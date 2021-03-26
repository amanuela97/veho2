import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

function AppButton({
  title,
  onPress,
  color = "#00adef",
  buttonWidth = "100%",
  buttonIsInActive = false,
}) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color, width: buttonWidth }]}
      onPress={onPress}
      disabled={buttonIsInActive}
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
    color: "white",
    fontSize: 15,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default AppButton;
