import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../config/colors";

function AppButton({
  title,
  onPress,
  color = "primary",
  buttonWidth = "100%",
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: "#00adef", width: buttonWidth },
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "black",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    marginVertical: 10,
  },
  text: {
    color: colors.white,
    fontSize: 15,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default AppButton;
