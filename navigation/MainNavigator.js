import React from "react";
import { View, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import VehicleStatus from "../screens/VehicleStatus";
import HomeStack from "./HomeStack";
import TabNavigator from "./TabNavigator";
import { DrawerContent } from "./DrawerContents";
import SettingScreen from "../screens/SettingScreen";
import FeedbackScreen from "../screens/FeedbackScreen";
import { addVehicle } from "../Api/DbRequests";
import AddVehicleScreen from "../screens/AddVehicleScreen";
import useNotifications from "../hooks/useNotifications";

const Drawer = createDrawerNavigator();

const MainNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen
        name="Home"
        options={{ headerShown: false }}
        component={TabNavigator}
      />
      <Drawer.Screen name="Vehicle" component={AddVehicleScreen} />
      <Drawer.Screen name="Setting" component={SettingScreen} />
      <Drawer.Screen name="Feedback" component={FeedbackScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default MainNavigator;
