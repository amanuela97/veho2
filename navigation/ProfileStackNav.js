import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@react-navigation/native";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileEditScreen from "../screens/ProfileEditScreen";

const Stack = createStackNavigator();

//

const ProfileStackNav = ({ navigation }) => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: colors.text,
        headerStyle: {
          backgroundColor: colors.header,
        },
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={ProfileEditScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStackNav;
