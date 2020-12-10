import { useTheme } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../components/AppText";

function SettingScreen(props) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <AppText style={{ color: colors.text }}>setting</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SettingScreen;
