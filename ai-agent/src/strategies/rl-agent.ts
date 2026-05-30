import * as tf from "@tensorflow/tfjs-node";
import type { Strategy } from "./base.js";
import type { GameState, Action } from "../types.js";
import { writeFileSync, readFileSync, existsSync } from "fs";

const MODEL_PATH = "./models/rl-policy";
const STATE_DIM = 20;  // Encoded state vector size
const ACTION_DIM = 4;  // up/down/left/right shoot quadrant

/**
 * Reinforcement Learning Agent (DQN)
 *
 * Uses a Deep Q-Network trained on self-play sessions.
 * Encodes game state into a fixed-size feature vector,
 * outputs Q-values for discrete action space.
 *
 * Architecture: 3-layer MLP with ReLU, epsilon-greedy exploration.
 * Training: REINFORCE with experience replay buffer.
 */
export class RLAgent implements Strategy {
  private model!: tf.Sequential;
  private epsilon = 0.3; // Exploration rate (decays during training)
  private replayBuffer: Array<{
    state: number[];
    action: number;
    reward: number;
    nextState: number[];
    done: boolean;
  }> = [];
  private readonly bufferSize = 10_000;
  private readonly batchSize = 64;
  private readonly gamma = 0.95; // Discount factor

  constructor() {
    this.model = this.buildModel();
    if (existsSync(`${MODEL_PATH}/model.json`)) {
      this.loadModel();
    }
  }

  private buildModel(): tf.Sequential {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 128, activation: "relu", inputShape: [STATE_DIM] }));
    model.add(tf.layers.dropout({ rate: 0.1 }));
    model.add(tf.layers.dense({ units: 64, activation: "relu" }));
    model.add(tf.layers.dense({ units: ACTION_DIM, activation: "linear" }));
    model.compile({ optimizer: tf.train.adam(0.001), loss: "meanSquaredError" });
    return model;
  }

  async decide(state: GameState): Promise<Action> {
    const encoded = this.encodeState(state);

    // Epsilon-greedy: explore randomly or exploit model
    if (Math.random() < this.epsilon) {
      return this.randomAction(state);
    }

    const qValues = this.model.predict(
      tf.tensor2d([encoded])
    ) as tf.Tensor;
    const actionIdx = (await qValues.argMax(1).data())[0];
    qValues.dispose();

    return this.decodeAction(actionIdx, state);
  }

  /**
   * Encode game state into fixed-length float vector.
   * Features: player pos, top-3 blob positions/types/distances, combo state, wave.
   */
  private encodeState(state: GameState): number[] {
    const { canvasWidth: W, canvasHeight: H } = state;
    const sorted = [...state.blobs].sort((a, b) => b.points - a.points).slice(0, 3);

    const features: number[] = [
      // Player position (normalized)
      state.playerPosition.x / W,
      state.playerPosition.y / H,
      // Top 3 blob features (position + type + hp)
      ...sorted.flatMap((b) => [
        b.position.x / W,
        b.position.y / H,
        b.radius / 50,
        b.hp / 5,
        ["normal", "fast", "armored", "boss"].indexOf(b.type) / 3,
      ]),
      // Pad to 17 if fewer than 3 blobs
      ...Array(Math.max(0, 3 - sorted.length)).fill(0).flatMap(() => [0, 0, 0, 0, 0]),
      // Combo
      Math.min(state.combo.count / 10, 1),
      state.combo.timeLeftMs / 500,
      // Wave
      Math.min(state.wave / 20, 1),
    ];

    return features.slice(0, STATE_DIM);
  }

  private randomAction(state: GameState): Action {
    if (state.blobs.length === 0) return { type: "idle" };
    const blob = state.blobs[Math.floor(Math.random() * state.blobs.length)];
    return { type: "shoot", target: blob.position };
  }

  private decodeAction(idx: number, state: GameState): Action {
    if (state.blobs.length === 0) return { type: "idle" };
    // Map action index to a quadrant, find nearest blob in that quadrant
    const cx = state.canvasWidth / 2;
    const cy = state.canvasHeight / 2;
    const quadrants = [
      (b: { position: { x: number; y: number } }) => b.position.x < cx && b.position.y < cy, // top-left
      (b: { position: { x: number; y: number } }) => b.position.x >= cx && b.position.y < cy, // top-right
      (b: { position: { x: number; y: number } }) => b.position.x < cx && b.position.y >= cy, // bottom-left
      (b: { position: { x: number; y: number } }) => b.position.x >= cx && b.position.y >= cy, // bottom-right
    ];
    const candidates = state.blobs.filter(quadrants[idx] ?? (() => true));
    const target = (candidates.length > 0 ? candidates : state.blobs)[0];
    return { type: "shoot", target: target.position };
  }

  /** Train using a collected experience buffer (offline REINFORCE) */
  async train(episodes: number): Promise<void> {
    console.log(`Training RL agent for ${episodes} episodes...`);
    for (let ep = 0; ep < episodes; ep++) {
      this.epsilon = Math.max(0.05, this.epsilon * 0.999); // Decay exploration
      if (this.replayBuffer.length >= this.batchSize) {
        await this.trainStep();
      }
      if (ep % 100 === 0) {
        console.log(`  Episode ${ep}/${episodes} | ε=${this.epsilon.toFixed(3)}`);
      }
    }
    await this.saveModel();
    console.log("Training complete. Model saved.");
  }

  private async trainStep(): Promise<void> {
    const batch = this.sampleBuffer();
    const states = tf.tensor2d(batch.map((b) => b.state));
    const nextStates = tf.tensor2d(batch.map((b) => b.nextState));
    const qNext = this.model.predict(nextStates) as tf.Tensor;
    const qNextMax = qNext.max(1);
    const targets = this.model.predict(states) as tf.Tensor2D;
    const targetsArr = await targets.array() as number[][];

    for (let i = 0; i < batch.length; i++) {
      const { action, reward, done } = batch[i];
      targetsArr[i][action] = done
        ? reward
        : reward + this.gamma * (await qNextMax.slice([i], [1]).data())[0];
    }

    await this.model.fit(states, tf.tensor2d(targetsArr), { epochs: 1, verbose: 0 });
    [states, nextStates, qNext, qNextMax, targets].forEach((t) => t.dispose());
  }

  addExperience(
    state: number[],
    action: number,
    reward: number,
    nextState: number[],
    done: boolean
  ): void {
    if (this.replayBuffer.length >= this.bufferSize) {
      this.replayBuffer.shift();
    }
    this.replayBuffer.push({ state, action, reward, nextState, done });
  }

  private sampleBuffer() {
    const shuffled = [...this.replayBuffer].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, this.batchSize);
  }

  private async saveModel(): Promise<void> {
    await this.model.save(`file://${MODEL_PATH}`);
  }

  private loadModel(): void {
    tf.loadLayersModel(`file://${MODEL_PATH}/model.json`)
      .then((m) => { this.model = m as tf.Sequential; })
      .catch(() => {});
  }
}
