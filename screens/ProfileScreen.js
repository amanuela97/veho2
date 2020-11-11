import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../components/AppText";

function ProfileScreen(props) {
  return (
    <View style={styles.container}>
      <AppText>profile</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

export default ProfileScreen;
