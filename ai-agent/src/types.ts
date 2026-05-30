export interface Vec2 {
  x: number;
  y: number;
}

export interface Blob {
  id: string;
  position: Vec2;
  radius: number;
  type: "normal" | "boss" | "fast" | "armored";
  hp: number;
  points: number;
}

export interface Projectile {
  id: string;
  position: Vec2;
  velocity: Vec2;
}

export interface ComboState {
  count: number;
  multiplier: number;
  timeLeftMs: number;
}

export interface GameState {
  isAlive: boolean;
  score: number;
  wave: number;
  lives: number;
  blobs: Blob[];
  projectiles: Projectile[];
  playerPosition: Vec2;
  combo: ComboState;
  canvasWidth: number;
  canvasHeight: number;
  timestamp: number;
}

export type ActionType = "shoot" | "move" | "idle";

export interface Action {
  type: ActionType;
  target?: Vec2;   // For shoot: aim target; for move: destination
}

export interface SessionResult {
  score: number;
  ticks: number;
  durationMs: number;
  tokensEarned: number;
  strategy: string;
  timestamp: number;
}

export interface MiningStats {
  totalSessions: number;
  totalScore: number;
  totalTokensEarned: number;
  bestScore: number;
  avgScore: number;
  totalPlaytimeMs: number;
  lastSession: SessionResult | null;
}
