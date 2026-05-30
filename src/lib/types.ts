/** Shared game state types used by both the game and the agent bridge */

export interface Vec2 { x: number; y: number; }

export interface BlobEntity {
  id: string;
  x: number;
  y: number;
  radius: number;
  type: "normal" | "boss" | "fast" | "armored";
  hp: number;
  points: number;
}

export interface GameState {
  isAlive: boolean;
  score: number;
  wave: number;
  lives: number;
  blobs: BlobEntity[];
  projectiles: Array<{ id: string; x: number; y: number; vx: number; vy: number }>;
  playerPosition: Vec2;
  combo: { count: number; multiplier: number; timeLeftMs: number };
  canvasWidth: number;
  canvasHeight: number;
}
