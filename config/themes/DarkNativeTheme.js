import {} from "@react-navigation/native";
import { DarkTheme } from "@react-navigation/native";
import { DarkTheme as PaperDarkTheme } from "react-native-paper";

export const CustomNativeDarkTheme = {
  ...DarkTheme,
  ...PaperDarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...PaperDarkTheme.colors,
    background: "black",
    primary: "#00adef",
    secondary: "#fb3664",
    textMain: "white",
    textLight: "#d6d6d6",
    drawer: "#333333",
    header: "#333333",
    negative: "white",
    tab: "white",
    separator: "#828282",
    chargerList: "#16161d",
  },
};
