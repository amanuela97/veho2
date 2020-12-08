import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import colors from "../../config/colors";
import AppText from "../AppText";
import { MaterialIcons } from "@expo/vector-icons";
function ListItemAddQueueAction({
  onPress,
  onPressCancel,
  vehicleQueue,
  confirmation,
  assigned,
}) {
  return (
    <>
      {!vehicleQueue && !confirmation && !assigned && (
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={styles.container}>
            <Entypo name="add-to-list" size={35} color="white" />
            <AppText style={{ fontSize: 10, color: "white" }}>Queue</AppText>
          </View>
        </TouchableWithoutFeedback>
      )}
      {(vehicleQueue || assigned || confirmation) && (
        <TouchableWithoutFeedback onPress={onPressCancel}>
          <View style={styles.containerD}>
            <MaterialIcons name="cancel" size={35} color="white" />
            <AppText style={{ fontSize: 10, color: "white" }}>Queue</AppText>
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "green",
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  containerD: {
    backgroundColor: "black",
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});

export default ListItemAddQueueAction;
