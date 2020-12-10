import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@react-navigation/native";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileEditScreen from "../screens/ProfileEditScreen";
import i18n from 'i18n-js';

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
      <Stack.Screen name={i18n.t("Profile")} component={ProfileScreen} />
      <Stack.Screen name="EditProfile" options={{ headerTitle :i18n.t("EditProfile")}} component={ProfileEditScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStackNav;
