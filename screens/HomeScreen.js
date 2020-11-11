import React from "react";
import { View, StyleSheet } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <AppText style={{ margin: 20, color: colors.text }}>
        home is home and home is greate from here every one can{" "}
      </AppText>
      <AppButton
        title="go booking"
        onPress={() => navigation.navigate("Booking")}
      />
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

export default HomeScreen;
