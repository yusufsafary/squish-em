import { useState, useEffect } from "react";

export interface LeaderboardEntry {
  rank: number;
  address: string;
  score: number;
}

/**
 * Phase 3: Will fetch from on-chain Solana leaderboard program.
 * Currently returns mock data.
 */
export function useLeaderboard() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData([
        { rank: 1, address: "7xKXt...9mNp", score: 142800 },
        { rank: 2, address: "3fGhR...2kLq", score: 98400 },
        { rank: 3, address: "9pQwZ...5jYt", score: 87300 },
        { rank: 4, address: "2mNvB...8hXc", score: 65100 },
        { rank: 5, address: "6rTsU...1gWf", score: 54200 },
      ]);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
}
