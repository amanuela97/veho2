import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import LottieView from "lottie-react-native";
import { useTheme } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

function CarAnim({ autoPlayAnim }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <LottieView
        autoPlay
        loop={autoPlayAnim}
        source={require("../assets/chcha.json")}
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
