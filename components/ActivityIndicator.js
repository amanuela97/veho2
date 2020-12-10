import React from "react";
import LottieView from "lottie-react-native";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

function ActivityIndicator({ visible = false }) {
  const { colors } = useTheme();

  if (!visible) return null;

  return (
    <View style={[styles.overlay, { backgroundColor: colors.background }]}>
      <View style={{ width: 150, height: 150 }}>
        <LottieView autoPlay loop source={require("../assets/loading.json")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    opacity: 0.8,
    width: "100%",
    zIndex: 1,
  },
});

export default ActivityIndicator;
