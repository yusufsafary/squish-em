import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface WalletState {
  publicKey: string | null;
  squishBalance: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

/**
 * Phase 3: Will integrate with Phantom/Solflare wallet adapters.
 * Currently a stub store.
 */
export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      publicKey: null,
      squishBalance: null,
      connect: async () => {
        // TODO: integrate mobile wallet adapter (Q3 2026)
        // import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol-web3js"
        console.log("Wallet connect — coming Q3 2026");
      },
      disconnect: () => set({ publicKey: null, squishBalance: null }),
    }),
    {
      name: "squish-wallet",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
