import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import defaultStyles from "../config/styles";
import { Divider } from "react-native-paper";
import { useTheme } from "@react-navigation/native";

function AppTextInput({ icon, width = "100%", ...otherProps }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { width, backgroundColor: colors.header }]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={defaultStyles.colors.medium}
          style={styles.icon}
        />
      )}
      <Divider />
      <TextInput
        placeholderTextColor={colors.textLight}
        maxLength={30}
        color={colors.text}
        style={{ width: "100%" }}
        {...otherProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f7f6f9",

    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 18,
    height: 25,
    fontFamily: "OpenSans_400Regular",
    width: "90%",
  },
});

export default AppTextInput;
