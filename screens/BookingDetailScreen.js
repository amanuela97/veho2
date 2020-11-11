import React from "react";
import { View, StyleSheet } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";

function BookingDetailScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <AppText>booking detail</AppText>
      <AppButton
        title="go booking"
        onPres={() => navigation.navigate("Home")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

export default BookingDetailScreen;
