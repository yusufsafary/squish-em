import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#FF6B9D" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          contentStyle: { backgroundColor: "#1a1a2e" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="game" options={{ title: "SQUISH EM!", headerShown: false }} />
        <Stack.Screen name="nft-skins" options={{ title: "NFT Skins" }} />
        <Stack.Screen name="wallet" options={{ title: "Wallet" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
