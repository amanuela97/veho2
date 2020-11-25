import {} from "@react-navigation/native";
import { DefaultTheme } from "@react-navigation/native";
import { DefaultTheme as PaperDefaultTheme } from "react-native-paper";

export const CustomLightNativeTheme = {
  ...DefaultTheme,
  ...PaperDefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...PaperDefaultTheme.colors,
    background: "white",
    primary: "#00adef",
    secondary: "#fb3664",
    textMain: "#0c0c0c",
    textLight: "#6e6969",
    drawer: "white",
    header: "#fafafa",
    chargerList: "#fafafa",
    negative: "black",
    tab: "#202020",
    separator: "#f8f4f4",
  },
};
