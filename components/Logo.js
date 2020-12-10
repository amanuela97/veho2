import { useTheme } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "./AppText";

function Logo({ topFontsize = 35, bottomFontsize = 50, veho = "#fff" }) {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <AppText style={[styles.name, { fontSize: topFontsize, color: veho }]}>
          VEHO
        </AppText>
      </View>
      <View style={styles.bottom}>
        <AppText style={[styles.go, { fontSize: bottomFontsize }]}>GO</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  name: {
    fontFamily: "OpenSans_800ExtraBold_Italic",
    alignSelf: "center",
    fontSize: 35,
  },
  go: {
    alignSelf: "center",
    fontSize: 50,
    color: "#00adef",
    fontFamily: "OpenSans_800ExtraBold",
  },
  bottom: {
    marginTop: -15,
  },
});

export default Logo;
