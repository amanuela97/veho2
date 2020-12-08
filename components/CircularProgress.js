import React from "react";
import { View, StyleSheet } from "react-native";
import ProgressCircle from "react-native-progress-circle";
import { Feather } from "@expo/vector-icons";

import AppText from "./AppText";
import { useTheme } from "@react-navigation/native";
function CircularProgress({ battery }) {
  const { colors } = useTheme();
  const color = (battery) => {
    if (battery > 69) {
      return "green";
    } else if (battery > 39 && battery < 70) {
      return "#f4b860";
    } else {
      return "tomato";
    }
  };
  return (
    <View style={styles.container}>
      <ProgressCircle
        percent={battery}
        radius={34}
        borderWidth={5}
        color={color(battery)}
        shadowColor="#999"
        bgColor={colors.vehicle}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={{ flexDirection: "row" }}>
            <AppText
              style={{ fontFamily: "OpenSans_600SemiBold", color: colors.text }}
            >
              {battery}
            </AppText>
            <AppText style={{ fontSize: 8, color: colors.textLight }}>
              %
            </AppText>
          </View>
          <Feather name="battery-charging" size={12} color={colors.textLight} />
        </View>
      </ProgressCircle>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default CircularProgress;
