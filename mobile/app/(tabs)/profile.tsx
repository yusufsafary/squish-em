import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useWalletStore } from "../../store/wallet";

export default function ProfileScreen() {
  const router = useRouter();
  const { publicKey, connect, disconnect } = useWalletStore();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Profile</Text>

      {publicKey ? (
        <>
          <View style={styles.walletCard}>
            <Text style={styles.walletLabel}>Connected Wallet</Text>
            <Text style={styles.walletAddress}>{publicKey.slice(0, 8)}...{publicKey.slice(-8)}</Text>
          </View>

          <TouchableOpacity style={styles.nftButton} onPress={() => router.push("/nft-skins")}>
            <Text style={styles.nftButtonText}>✨ My NFT Skins</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.disconnectButton} onPress={disconnect}>
            <Text style={styles.disconnectText}>Disconnect Wallet</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.connectContainer}>
          <Text style={styles.connectDesc}>
            Connect your Solana wallet to access NFT blob skins, earn SQUISH tokens, and post scores on-chain.
          </Text>
          <TouchableOpacity style={styles.connectButton} onPress={connect}>
            <Text style={styles.connectButtonText">Connect Wallet</Text>
          </TouchableOpacity>
          <Text style={styles.comingSoon}>Solana integration — Q3 2026</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a2e", padding: 24 },
  heading: { fontSize: 28, fontWeight: "800", color: "#fff", marginBottom: 24 },
  walletCard: {
    backgroundColor: "#16213e",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#FF6B9D55",
    marginBottom: 16,
  },
  walletLabel: { fontSize: 12, color: "#aaa", marginBottom: 4 },
  walletAddress: { fontSize: 14, color: "#FF6B9D", fontFamily: "monospace" },
  nftButton: {
    backgroundColor: "#FF6B9D",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  nftButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  disconnectButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#555",
  },
  disconnectText: { color: "#aaa", fontSize: 14 },
  connectContainer: { alignItems: "center", marginTop: 40 },
  connectDesc: { color: "#aaa", textAlign: "center", lineHeight: 22, marginBottom: 32 },
  connectButton: {
    backgroundColor: "#9945FF",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 16,
  },
  connectButtonText: { color: "#fff", fontWeight: "800", fontSize: 18 },
  comingSoon: { color: "#555", fontSize: 12 },
});
