import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { useRef, useState } from "react";
import { useMiningStore } from "../../store/mining";
import { calculateReward } from "../../../blockchain/sdk/src/mining";
import { Colors } from "../../constants/colors";

const GAME_URL = "https://yusufsafary.github.io/squish-em/game.html";

/**
 * Mine Tab — Mobile AI Mining Agent screen.
 *
 * The game runs in a WebView. The agent injects JavaScript that:
 * 1. Reads window.__SQUISH_STATE__ every 50ms
 * 2. Decides the best shot using the selected strategy
 * 3. Dispatches synthetic touch events on the canvas
 *
 * On session end, submits proof to game server and claims SQUISH tokens.
 */
export default function MineScreen() {
  const webviewRef = useRef<WebView>(null);
  const store = useMiningStore();
  const [webviewReady, setWebviewReady] = useState(false);

  const isRunning = store.status === "running";

  function startAgent() {
    if (!webviewRef.current) return;
    store.setStatus("running");

    // Inject agent script into WebView
    webviewRef.current.injectJavaScript(buildAgentScript(store.strategy));
  }

  function stopAgent() {
    webviewRef.current?.injectJavaScript("window.__SQUISH_AGENT_ACTIVE__ = false; true;");
    store.setStatus("idle");
  }

  function handleWebViewMessage(event: any) {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === "SCORE_UPDATE") {
        store.setCurrentScore(msg.score);
      }
      if (msg.type === "GAME_OVER") {
        const tokensEarned = calculateReward(msg.score);
        store.recordSession({
          score: msg.score,
          tokensEarned,
          strategy: store.strategy,
          durationMs: msg.durationMs,
          timestamp: Date.now(),
        });
      }
    } catch {}
  }

  return (
    <View style={styles.container}>
      {/* Game WebView */}
      <View style={styles.webviewContainer}>
        <WebView
          ref={webviewRef}
          source={{ uri: GAME_URL }}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
          onLoadEnd={() => setWebviewReady(true)}
          onMessage={handleWebViewMessage}
        />
        {!webviewReady && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={Colors.primary} size="large" />
          </View>
        )}
      </View>

      {/* Agent Controls */}
      <View style={styles.controls}>
        {/* Strategy selector */}
        <View style={styles.strategyRow}>
          {(["greedy", "combo"] as const).map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.strategyBtn, store.strategy === s && styles.strategyBtnActive]}
              onPress={() => store.setStrategy(s)}
              disabled={isRunning}
            >
              <Text style={[styles.strategyText, store.strategy === s && styles.strategyTextActive]}>
                {s === "greedy" ? "⚡ Greedy" : "🔗 Combo"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatBox label="Sessions" value={store.sessions.length} />
          <StatBox label="Best Score" value={store.bestScore.toLocaleString()} />
          <StatBox label="SQUISH" value={store.totalTokensEarned} highlight />
        </View>

        {/* Current score while running */}
        {isRunning && (
          <View style={styles.liveScore}>
            <Text style={styles.liveScoreLabel}>Live Score</Text>
            <Text style={styles.liveScoreValue}>{store.currentScore.toLocaleString()}</Text>
          </View>
        )}

        {/* Start/Stop */}
        <TouchableOpacity
          style={[styles.mainBtn, isRunning && styles.mainBtnStop]}
          onPress={isRunning ? stopAgent : startAgent}
          disabled={!webviewReady}
        >
          <Text style={styles.mainBtnText}>{isRunning ? "⏹ Stop Agent" : "▶ Start Mining"}</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>On-chain token rewards · Q3 2026</Text>
      </View>

      {/* Recent sessions */}
      {store.sessions.length > 0 && (
        <FlatList
          data={[...store.sessions].reverse().slice(0, 5)}
          keyExtractor={(_, i) => String(i)}
          style={styles.sessionList}
          renderItem={({ item }) => (
            <View style={styles.sessionRow}>
              <Text style={styles.sessionScore}>{item.score.toLocaleString()} pts</Text>
              <Text style={styles.sessionTokens}>+{item.tokensEarned} SQUISH</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

/** Generate JS to inject into the game WebView */
function buildAgentScript(strategy: "greedy" | "combo"): string {
  return `
(function() {
  window.__SQUISH_AGENT_ACTIVE__ = true;
  const STRATEGY = "${strategy}";
  let startTime = Date.now();

  function tick() {
    if (!window.__SQUISH_AGENT_ACTIVE__) return;
    const state = window.__SQUISH_STATE__;
    if (!state) { setTimeout(tick, 100); return; }

    if (!state.isAlive) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: "GAME_OVER",
        score: state.score,
        durationMs: Date.now() - startTime,
      }));
      // Auto-restart after 2s
      setTimeout(() => {
        if (window.__SQUISH_AGENT_ACTIVE__) {
          window.__SQUISH_START__ && window.__SQUISH_START__();
          startTime = Date.now();
          setTimeout(tick, 500);
        }
      }, 2000);
      return;
    }

    // Post score update
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: "SCORE_UPDATE", score: state.score }));

    // Decide action
    const blobs = state.blobs || [];
    if (blobs.length > 0) {
      const player = state.playerPosition || { x: 400, y: 300 };
      let target;
      if (STRATEGY === "combo" && state.combo && state.combo.count > 2) {
        const cx = blobs.reduce((s, b) => s + b.x, 0) / blobs.length;
        const cy = blobs.reduce((s, b) => s + b.y, 0) / blobs.length;
        target = blobs.reduce((a, b) =>
          Math.hypot(b.x - cx, b.y - cy) < Math.hypot(a.x - cx, a.y - cy) ? b : a
        );
      } else {
        target = blobs.reduce((a, b) =>
          b.points / (Math.hypot(b.x - player.x, b.y - player.y) + 1) >
          a.points / (Math.hypot(a.x - player.x, a.y - player.y) + 1) ? b : a
        );
      }

      // Dispatch click on canvas
      const canvas = document.querySelector("canvas");
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const ev = new MouseEvent("click", {
          clientX: rect.left + target.x,
          clientY: rect.top + target.y,
          bubbles: true,
        });
        canvas.dispatchEvent(ev);
      }
    }

    setTimeout(tick, 50);
  }

  // Start game then tick
  window.__SQUISH_START__ && window.__SQUISH_START__();
  setTimeout(tick, 800);
})();
true;
  `;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  webviewContainer: { height: 240, position: "relative" },
  webview: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  controls: { padding: 16 },
  strategyRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  strategyBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  strategyBtnActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}22` },
  strategyText: { color: Colors.textMuted, fontWeight: "600" },
  strategyTextActive: { color: Colors.primary },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  liveScore: {
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${Colors.primary}44`,
  },
  liveScoreLabel: { fontSize: 11, color: Colors.textMuted },
  liveScoreValue: { fontSize: 24, fontWeight: "900", color: Colors.primary },
  mainBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 8,
  },
  mainBtnStop: { backgroundColor: Colors.error },
  mainBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  footer: { textAlign: "center", fontSize: 11, color: Colors.textMuted },
  sessionList: { paddingHorizontal: 16, maxHeight: 120 },
  sessionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 6,
  },
  sessionScore: { color: Colors.text, fontWeight: "600" },
  sessionTokens: { color: Colors.secondary, fontWeight: "600" },
});

function StatBox({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.surface, borderRadius: 12, padding: 10, alignItems: "center" }}>
      <Text style={{ fontSize: 18, fontWeight: "900", color: highlight ? Colors.secondary : Colors.text }}>
        {value}
      </Text>
      <Text style={{ fontSize: 10, color: Colors.textMuted, marginTop: 2 }}>{label}</Text>
    </View>
  );
}
