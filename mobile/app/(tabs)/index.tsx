import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.delay(100)} style={styles.titleContainer}>
        <Text style={styles.title}>SQUISH</Text>
        <Text style={styles.titleAccent}>EM!</Text>
        <Text style={styles.subtitle}>Kawaii Blob Shooter</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300)} style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => router.push("/play")}
        >
          <Text style={styles.playButtonText}>▶ PLAY NOW</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/leaderboard")}
        >
          <Text style={styles.secondaryButtonText}>🏆 Leaderboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/nft-skins")}
        >
          <Text style={styles.secondaryButtonText}>✨ NFT Skins</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.Text entering={FadeInDown.delay(600)} style={styles.versionText}>
        v1.0.0 — Beta
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 56,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 4,
  },
  titleAccent: {
    fontSize: 56,
    fontWeight: "900",
    color: "#FF6B9D",
    letterSpacing: 4,
    marginTop: -16,
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    marginTop: 8,
    letterSpacing: 2,
  },
  buttonsContainer: {
    width: "100%",
    gap: 12,
  },
  playButton: {
    backgroundColor: "#FF6B9D",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 2,
  },
  secondaryButton: {
    backgroundColor: "#16213e",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF6B9D44",
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  versionText: {
    position: "absolute",
    bottom: 32,
    color: "#555",
    fontSize: 12,
  },
});
