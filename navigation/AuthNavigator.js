import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import OnboardingScreen from "../screens/OnboardingScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import i18n from 'i18n-js';

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerTitleAlign: "center",
    }}
  >
    <Stack.Screen
      name="Onboarding"
      component={OnboardingScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Login" options={{ headerTitle :i18n.t("Login")}} component={LoginScreen} />
    <Stack.Screen name="Signup" options={{ headerTitle :i18n.t("signup")}} component={SignupScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
