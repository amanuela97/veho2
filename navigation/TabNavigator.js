import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HomeStack from "./HomeStack";
import ScheduleScreen from "../screens/ScheduleScreen";
import ChargerScreen from "../screens/ChargerScreen";
import { useTheme } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
const Tab = createMaterialBottomTabNavigator();

const TabNavigator = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="Booking"
      activeColor={colors.primary}
      inactiveColor={colors.text}
      barStyle={{ backgroundColor: colors.header }}
    >
      <Tab.Screen
        name="Booking"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          tabBarLabel: "Schedule",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="calendar-clock"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="EV Chargers"
        component={ChargerScreen}
        options={{
          tabBarLabel: "Chargers",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ChargerScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="charging-station" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
