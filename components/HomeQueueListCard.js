import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Card } from "react-native-paper";
import AppText from "./AppText";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTheme } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
function HomeQueueListCard({ onPress, currentCharge, cardVisible }) {
  const { colors } = useTheme();
  const car = currentCharge.currentUser;
  console.log(currentCharge);
  return (
    <Card style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.innerContainer}>
          <View style={styles.leftContainer}>
            <AppText style={styles.carName}>
              {car.currentVehicleName ? car.currentVehicleName : ""}
            </AppText>
            <AppText style={styles.chargerName}>{currentCharge.name}</AppText>
            {/* <AppText style={styles.vehicleData}>no vehicle data</AppText>
            <Image
              source={require("../assets/no-car.png")}
              style={styles.noVehicleIcon}
            /> */}
          </View>
          <View style={styles.rightContainer}>
            <View style={styles.queueContainer}>
              <AppText style={{ fontSize: 20, marginTop: -2 }}>100%</AppText>
              <Feather name="battery-charging" size={24} color="black" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    width: wp("60%"),
    height: hp("14%"),
    marginHorizontal: 10,
    backgroundColor: "#333333",
    alignSelf: "center",
  },
  innerContainer: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    padding: "4%",
  },
  leftContainer: {
    width: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  chargerName: {
    fontSize: wp("3%"),
    fontFamily: "OpenSans_600SemiBold",
    color: "white",
  },
  carName: {
    fontSize: wp("3.5%"),
    fontFamily: "OpenSans_600SemiBold",
    color: "white",
  },
  vehicleData: { fontSize: wp("2.5%"), color: "white" },
  noVehicleIcon: {
    width: 30,
    height: 30,
    marginVertical: "3%",
  },
  rightContainer: {
    width: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  queueContainer: {
    backgroundColor: "#fafafa",
    height: 80,
    width: 80,
    borderRadius: 40,
    elevation: 7,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeQueueListCard;
