import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";

/**
 * Phase 3: NFT Blob Skins marketplace on Solana.
 * Shows owned NFTs and allows purchase via SQUISH token.
 */
const PLACEHOLDER_SKINS = [
  { id: "1", name: "Classic Blob", rarity: "Common", price: 0, owned: true },
  { id: "2", name: "Neon Blob", rarity: "Rare", price: 100, owned: false },
  { id: "3", name: "Galaxy Blob", rarity: "Epic", price: 500, owned: false },
  { id: "4", name: "Golden Blob", rarity: "Legendary", price: 2000, owned: false },
];

const RARITY_COLORS: Record<string, string> = {
  Common: "#aaa",
  Rare: "#4FC3F7",
  Epic: "#CE93D8",
  Legendary: "#FFD700",
};

export default function NFTSkinsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>✨ NFT Blob Skins</Text>
      <Text style={styles.subtitle}>Powered by Solana — Q3 2026</Text>

      <FlatList
        data={PLACEHOLDER_SKINS}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={[styles.skinPreview, { borderColor: RARITY_COLORS[item.rarity] }]}>
              <Text style={styles.skinEmoji}>🫧</Text>
            </View>
            <Text style={styles.skinName}>{item.name}</Text>
            <Text style={[styles.rarity, { color: RARITY_COLORS[item.rarity] }]}>
              {item.rarity}
            </Text>
            {item.owned ? (
              <View style={styles.ownedBadge}>
                <Text style={styles.ownedText}>Owned</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.buyButton}>
                <Text style={styles.buyText}>{item.price} SQUISH</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a2e", padding: 16 },
  heading: { fontSize: 24, fontWeight: "800", color: "#fff", marginBottom: 4 },
  subtitle: { fontSize: 12, color: "#9945FF", marginBottom: 20 },
  card: {
    flex: 1,
    backgroundColor: "#16213e",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffffff11",
  },
  skinPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: "#0f3460",
  },
  skinEmoji: { fontSize: 40 },
  skinName: { fontSize: 14, fontWeight: "700", color: "#fff", textAlign: "center" },
  rarity: { fontSize: 11, fontWeight: "600", marginTop: 2, marginBottom: 10 },
  ownedBadge: {
    backgroundColor: "#1b5e20",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ownedText: { color: "#4CAF50", fontWeight: "700", fontSize: 12 },
  buyButton: {
    backgroundColor: "#9945FF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buyText: { color: "#fff", fontWeight: "700", fontSize: 12 },
});
