import { useTheme } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Card } from "react-native-paper";

import AppText from "./AppText";
import i18n from "i18n-js";

function HomeChargerList({ onPress, item, renderRightActions }) {
  const { colors } = useTheme();
  const length = item.status;
  const color = () => {
    if (item.status === "busy") return "tomato";
    else return "green";
  };
  const colorFill = color();

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
          <View style={styles.itemContainer}>
            <View style={styles.innerContainer}>
              <View style={styles.leftContainer}>
                <AppText
                  style={{
                    fontFamily: "OpenSans_600SemiBold",
                    color: "white",
                  }}
                >
                  {item.name}
                </AppText>
                <AppText style={{ color: "white" }}>{i18n.t("fast")}</AppText>
              </View>
              <View style={styles.rightContainer}>
                <View
                  style={[
                    styles.queueContainer,
                    { backgroundColor: colors.chargerList },
                  ]}
                >
                  <AppText
                    style={{ marginTop: -4, fontSize: 10, color: colors.text }}
                  >
                    {item.status}
                  </AppText>
                </View>
                <Card
                  style={[
                    styles.colorBarContainer,
                    { backgroundColor: colorFill },
                  ]}
                ></Card>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    elevation: 0,
    width: "100%",
    height: 80,
    marginVertical: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  itemContainer: {
    width: "90%",
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
  },
  innerContainer: {
    width: "96%",
    height: "90%",
    alignSelf: "center",
    flexDirection: "row",
  },
  leftContainer: { alignSelf: "center", width: "50%" },
  rightContainer: {
    alignSelf: "center",
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  queueContainer: {
    width: 50,
    height: 50,

    borderRadius: 25,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  colorBarContainer: {
    width: 6,
    height: "70%",
    elevation: 5,
    borderRadius: 3,
    backgroundColor: "orange",
    alignSelf: "flex-end",
  },
});

export default HomeChargerList;
