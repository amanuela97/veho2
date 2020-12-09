import { useTheme } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

import Text from "./AppText";

function PickerItem({ item, onPress }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ width: "100%", backgroundColor: "black" }}
    >
      <Text style={[styles.text, { color: "white" }]}>
        {item.name ? item.name : item.itemName}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    padding: 20,
  },
});

export default PickerItem;
