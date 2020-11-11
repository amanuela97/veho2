import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../components/AppText";

function ChargerScreen(props) {
  return (
    <View style={styles.container}>
      <AppText>charger</AppText>
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

export default ChargerScreen;
