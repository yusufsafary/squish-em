import { useState, useRef, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import * as Haptics from "expo-haptics";

const GAME_URL = "https://yusufsafary.github.io/squish-em/game.html";

export default function PlayScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [key, setKey] = useState(0);
  const webViewRef = useRef<WebView>(null);

  const handleLoad = useCallback(() => {
    setLoading(false);
    setError(false);
  }, []);

  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, []);

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(false);
    setKey(k => k + 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        key={key}
        ref={webViewRef}
        source={{ uri: GAME_URL }}
        style={styles.webview}
        // Performance & offline
        cacheEnabled
        cacheMode="LOAD_CACHE_ELSE_NETWORK"
        allowFileAccess={false}
        allowsProtectedMedia={false}
        // Security
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        // Content
        startInLoadingState={false}
        scalesPageToFit={false}
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        // Callbacks
        onLoad={handleLoad}
        onError={handleError}
        onHttpError={handleError}
        // Injected JS: report score + kills back to app
        injectedJavaScript={`
          (function() {
            const orig = localStorage.setItem.bind(localStorage);
            localStorage.setItem = function(k, v) {
              orig(k, v);
              if (k === 'squish_hi' || k === 'squish_total_blobs' || k === 'squish_coin_balance') {
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
                  JSON.stringify({ type: 'storage', key: k, value: v })
                );
              }
            };
          })();
          true;
        `}
      />

      {loading && !error && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#4ade80" />
          <Text style={styles.loadingText}>LOADING GAME…</Text>
        </View>
      )}

      {error && (
        <View style={styles.overlay}>
          <Text style={styles.errorEmoji}>💥</Text>
          <Text style={styles.errorTitle}>CONNECTION FAILED</Text>
          <Text style={styles.errorSub}>Check your internet and try again.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={handleRetry} activeOpacity={0.75}>
            <Text style={styles.retryText}>↺  RETRY</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d1a" },
  webview: { flex: 1, backgroundColor: "#0d0d1a" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0d0d1a",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: "#4ade80",
    fontFamily: "monospace",
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 14,
  },
  errorEmoji: { fontSize: 48, marginBottom: 4 },
  errorTitle: {
    color: "#f87171",
    fontFamily: "monospace",
    fontSize: 13,
    letterSpacing: 3,
    fontWeight: "bold",
  },
  errorSub: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    textAlign: "center",
    maxWidth: 240,
    lineHeight: 18,
  },
  retryBtn: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(74,222,128,0.4)",
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 10,
  },
  retryText: {
    color: "#4ade80",
    fontFamily: "monospace",
    fontSize: 13,
    letterSpacing: 2,
    fontWeight: "bold",
  },
});
