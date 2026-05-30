import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface MiningSession {
  score: number;
  tokensEarned: number;
  strategy: string;
  durationMs: number;
  timestamp: number;
  txSignature?: string;
}

export type MiningStatus = "idle" | "running" | "claiming" | "error";

interface MiningState {
  status: MiningStatus;
  strategy: "greedy" | "combo";
  sessions: MiningSession[];
  currentScore: number;
  totalTokensEarned: number;
  bestScore: number;
  errorMessage: string | null;

  setStatus: (status: MiningStatus) => void;
  setStrategy: (strategy: "greedy" | "combo") => void;
  setCurrentScore: (score: number) => void;
  recordSession: (session: MiningSession) => void;
  setError: (msg: string | null) => void;
  reset: () => void;
}

export const useMiningStore = create<MiningState>()(
  persist(
    (set, get) => ({
      status: "idle",
      strategy: "greedy",
      sessions: [],
      currentScore: 0,
      totalTokensEarned: 0,
      bestScore: 0,
      errorMessage: null,

      setStatus: (status) => set({ status }),
      setStrategy: (strategy) => set({ strategy }),
      setCurrentScore: (score) => set({ currentScore: score }),

      recordSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, session],
          totalTokensEarned: state.totalTokensEarned + session.tokensEarned,
          bestScore: Math.max(state.bestScore, session.score),
          currentScore: 0,
          status: "idle",
        })),

      setError: (errorMessage) => set({ errorMessage, status: "error" }),
      reset: () =>
        set({
          status: "idle",
          currentScore: 0,
          errorMessage: null,
        }),
    }),
    {
      name: "squish-mining",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        sessions: state.sessions,
        totalTokensEarned: state.totalTokensEarned,
        bestScore: state.bestScore,
        strategy: state.strategy,
      }),
    }
  )
);
