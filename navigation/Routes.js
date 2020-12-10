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
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import english from '../assets/localization/english';
import finnish from '../assets/localization/finnish';

const Routes = () => {
  const { userAuth, setUserAuth } = useContext(AuthContextMain);
  const [initializing, setInitializing] = useState(true);
  const [isDarkTheme, setDarkTheme] = useState(true);
  const [user, setUser] = useState({});
  let loadFont = fonts();
  const toggleTheme = useCallback(() => {
    setDarkTheme(!isDarkTheme);
  }, [isDarkTheme]);
  const appTheme = isDarkTheme ? CustomNativeDarkTheme : CustomLightNativeTheme;

  i18n.translations = {
    en: english,
    fi: finnish,
  };
  
  i18n.locale = Localization.locale; // Set the locale at the beginning of the app
  i18n.fallbacks = true // Can change to different language if not available

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
