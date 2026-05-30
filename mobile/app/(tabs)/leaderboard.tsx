import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useLeaderboard } from "../../hooks/useLeaderboard";

export default function LeaderboardScreen() {
  const { data, isLoading } = useLeaderboard();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🏆 Global Leaderboard</Text>
      <Text style={styles.subtitle}>On-chain scores via Solana — Q3 2026</Text>

      {isLoading ? (
        <ActivityIndicator color="#FF6B9D" size="large" style={{ marginTop: 48 }} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.rank.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.rank}>#{item.rank}</Text>
              <Text style={styles.address}>{item.address}</Text>
              <Text style={styles.score}>{item.score.toLocaleString()}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a2e", padding: 16 },
  heading: { fontSize: 24, fontWeight: "800", color: "#fff", marginBottom: 4 },
  subtitle: { fontSize: 12, color: "#FF6B9D", marginBottom: 24 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#FF6B9D22",
  },
  rank: { width: 36, fontSize: 16, fontWeight: "700", color: "#FF6B9D" },
  address: { flex: 1, fontSize: 12, color: "#aaa", fontFamily: "monospace" },
  score: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
