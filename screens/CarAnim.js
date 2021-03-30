import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { useTheme } from "@react-navigation/native";

function CarAnim({ autoPlayAnim }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <LottieView
        autoPlay
        loop={autoPlayAnim}
        source={require("../assets/carAnim.json")}
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  animation: {
    width: "100%",
    height: 15,
  },
  container: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CarAnim;
