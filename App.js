import React, { useCallback, useMemo, useState } from "react";
import { View, StyleSheet, Text } from "react-native";

import { AppLoading } from "expo";
import fonts from "./assets/fonts/Fonts";
import {
  Provider as PaperProvider,
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from "react-native-paper";
import {
  NavigationContainer,
  DefaultTheme as NativeDefaultTheme,
} from "@react-navigation/native";
import AuthNavigator from "./navigation/AuthNavigator";
import MainNavigator from "./navigation/MainNavigator";
import { CustomLightNativeTheme } from "./config/themes/LightNativeTheme";
import { CustomNativeDarkTheme } from "./config/themes/DarkNativeTheme";
import { CustomThemeProvider, useCustomTheme } from "./context/ThemeContext";
import { AppContext } from "./context/AppThemeContext";

export default function App() {
  const [isDarkTheme, setDarkTheme] = useState(false);
  let loadFont = fonts();
  const toggleTheme = useCallback(() => {
    setDarkTheme(!isDarkTheme);
  }, [isDarkTheme]);
  const appTheme = isDarkTheme ? CustomNativeDarkTheme : CustomLightNativeTheme;
  //const appTheme = CustomNativeDarkTheme;

  if (!loadFont) {
    return <AppLoading />;
  } else {
    return (
      <AppContext.Provider value={{ toggleTheme, isDarkTheme }}>
        <PaperProvider theme={appTheme}>
          <NavigationContainer theme={appTheme}>
            <MainNavigator />
          </NavigationContainer>
        </PaperProvider>
      </AppContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 100,
  },
});
