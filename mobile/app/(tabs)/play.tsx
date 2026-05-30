import { View, Text, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

/**
 * Phase 2: Game screen embeds the HTML5 canvas game via WebView.
 * Full native reimplementation planned for v2.0.
 */
export default function PlayScreen() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: "https://yusufsafary.github.io/squish-em/game.html" }}
        style={styles.webview}
        allowsFullscreenVideo
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a2e" },
  webview: { flex: 1 },
});
