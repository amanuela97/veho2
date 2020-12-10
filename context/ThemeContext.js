import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();
const ThemeUpdateContext = createContext();

export function useCustomTheme() {
  return useContext(ThemeContext);
}

export function useCustomThemeUpdate() {
  return useContext(ThemeUpdateContext);
}

export function CustomThemeProvider(props) {
  const [isDarkTheme, setIsDarkThem] = useState(false);
  const switchTheme = () => {
    setIsDarkThem(!isDarkTheme);
  };

  return (
    <ThemeContext.Provider value={isDarkTheme}>
      <ThemeUpdateContext.Provider value={switchTheme}>
        {props.children}
      </ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  );
}
