import React, { useCallback, useEffect, useState } from "react";
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
import { AppContext } from "./context/AppThemeContext";
import { db_auth, db_store } from "./Api/Db";
import { AppAuthContext } from "./context/AppAuthContext";
import { get } from "react-native/Libraries/Utilities/PixelRatio";

export default function App() {
  const [isDarkTheme, setDarkTheme] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  let loadFont = fonts();
  const toggleTheme = useCallback(() => {
    setDarkTheme(!isDarkTheme);
  }, [isDarkTheme]);
  const appTheme = isDarkTheme ? CustomNativeDarkTheme : CustomLightNativeTheme;

  const onAuthStateChanged = async (user) => {
    setInitializing(true);
    console.log("user state changed");
    await setUser(user);
    if (user != null) {
      const data = await db_store.collection("users").doc(user.uid).get();
      setUser(data.data());
    }
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const unsubscribe = db_auth.onAuthStateChanged(onAuthStateChanged);
    return () => {
      unsubscribe();
    };
  }, []);

  if (!loadFont || initializing) {
    return <AppLoading />;
  } else {
    return (
      <AppContext.Provider value={{ toggleTheme, isDarkTheme }}>
        <PaperProvider theme={appTheme}>
          <AppAuthContext.Provider value={{ user, setUser }}>
            <NavigationContainer theme={appTheme}>
              {user ? <MainNavigator /> : <AuthNavigator />}
            </NavigationContainer>
          </AppAuthContext.Provider>
        </PaperProvider>
      </AppContext.Provider>
    );
  }
}
1;
