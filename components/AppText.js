import { useTheme } from "@react-navigation/native";
import React from "react";
import { Text, StyleSheet } from "react-native";
import colors from "../config/colors";

function AppText({ children, style, ...otherProps }) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.text, style]} {...otherProps}>
      {children}
    </Text>
  );
}
const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontFamily: "OpenSans_400Regular",
    color: colors.text,
  },
});

export default AppText;
