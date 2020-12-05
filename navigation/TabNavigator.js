import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import HomeStack from "./HomeStack";
import { useTheme } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileStackNav from "./ProfileStackNav";
import VehicleStatus from "../screens/VehicleStatus";
const Tab = createMaterialBottomTabNavigator();

const TabNavigator = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="Booking"
      activeColor={colors.primary}
      inactiveColor={colors.tab}
      barStyle={{ backgroundColor: colors.header }}
    >
      <Tab.Screen
        name="Booking"
        component={HomeStack}
        options={{
          tabBarLabel: "explore",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="explore" size={26} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="EV Chargers"
        component={VehicleStatus}
        options={{
          tabBarLabel: "vehicles",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="car-electric"
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNav}
        options={{
          tabBarLabel: "profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
