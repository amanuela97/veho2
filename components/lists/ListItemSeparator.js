import { useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";

function ListItemSeparator() {
  const { colors } = useTheme();
  return (
    <View style={[styles.separator, { backgroundColor: colors.separator }]} />
  );
}

const styles = StyleSheet.create({
  separator: {
    width: "100%",
    height: 1,
  },
});

export default ListItemSeparator;
