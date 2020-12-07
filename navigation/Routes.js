import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  Provider as PaperProvider,
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from "react-native-paper";
import {
  NavigationContainer,
  DefaultTheme as NativeDefaultTheme,
} from "@react-navigation/native";
import { AuthContextMain, AuthProvider } from "../context/AppAuthContextMain";
import fonts from "../assets/fonts/Fonts";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import { db_auth } from "../Api/Db";
import ActivityIndicator from "../components/ActivityIndicator";
import { AppContext } from "../context/AppThemeContext";
import { CustomNativeDarkTheme } from "../config/themes/DarkNativeTheme";
import { CustomLightNativeTheme } from "../config/themes/LightNativeTheme";
import { AppAuthContext } from "../context/AppAuthContext";

const Routes = () => {
  const { userAuth, setUserAuth } = useContext(AuthContextMain);
  const [initializing, setInitializing] = useState(true);
  const [isDarkTheme, setDarkTheme] = useState(false);
  const [user, setUser] = useState({});
  let loadFont = fonts();
  const toggleTheme = useCallback(() => {
    setDarkTheme(!isDarkTheme);
  }, [isDarkTheme]);
  const appTheme = isDarkTheme ? CustomNativeDarkTheme : CustomLightNativeTheme;

  const onAuthStateChanged = (user) => {
    setUserAuth(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = db_auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (!loadFont || initializing) return <ActivityIndicator visible={true} />;

  return (
    <AppContext.Provider value={{ toggleTheme, isDarkTheme }}>
      <AppAuthContext.Provider value={{ user, setUser }}>
        <PaperProvider theme={appTheme}>
          <NavigationContainer theme={appTheme}>
            {userAuth ? <MainNavigator /> : <AuthNavigator />}
          </NavigationContainer>
        </PaperProvider>
      </AppAuthContext.Provider>
    </AppContext.Provider>
  );
};

export default Routes;
