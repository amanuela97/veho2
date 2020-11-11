import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../AppText";
import * as Animatable from "react-native-animatable";
import Text from "../AppText";

function ErrorMessage({ error, visible }) {
  if (!visible || !error) return null;

  return (
    <Animatable.View animation="shake" duration={2000}>
      <AppText style={styles.error}>{error}</AppText>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  error: { color: "red" },
});

export default ErrorMessage;
