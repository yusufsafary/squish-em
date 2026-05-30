import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useWalletStore } from "../store/wallet";

export default function WalletScreen() {
  const { publicKey, squishBalance } = useWalletStore();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Wallet</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>SQUISH Token Balance</Text>
        <Text style={styles.balance}>{squishBalance ?? "—"}</Text>
        <Text style={styles.balanceUnit}>SQUISH</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Solana Integration</Text>
        <Text style={styles.infoText}>
          • SQUISH token: Earn by playing, spend on NFT skins{"\n"}
          • On-chain leaderboard: Submit scores to Solana{"\n"}
          • NFT skins: Unique blob appearances as SPL NFTs{"\n"}
          • Wallet: Phantom, Solflare, Backpack support
        </Text>
        <Text style={styles.eta}>Available Q3 2026</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a2e", padding: 24 },
  heading: { fontSize: 28, fontWeight: "800", color: "#fff", marginBottom: 24 },
  balanceCard: {
    backgroundColor: "#16213e",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#9945FF55",
    marginBottom: 20,
  },
  balanceLabel: { fontSize: 12, color: "#aaa", marginBottom: 8 },
  balance: { fontSize: 48, fontWeight: "900", color: "#fff" },
  balanceUnit: { fontSize: 16, color: "#9945FF", fontWeight: "700", marginTop: 4 },
  infoCard: {
    backgroundColor: "#16213e",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ffffff11",
  },
  infoTitle: { fontSize: 16, fontWeight: "700", color: "#fff", marginBottom: 12 },
  infoText: { fontSize: 14, color: "#aaa", lineHeight: 24 },
  eta: { marginTop: 16, fontSize: 12, color: "#9945FF", fontWeight: "600" },
});
