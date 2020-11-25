import { useTheme } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Card } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from "./AppText";

function HomeChargerList({ onPress, item }) {
  const { colors } = useTheme();
  const length = item.queue.length;
  const color = () => {
    if (length < 3) return "#177245";
    else if (length > 2 && length < 5) return "orange";
    else if (length > 4) return "tomato";
  };
  const colorFill = color();

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, { backgroundColor: colors.header }]}>
        <View style={styles.itemContainer}>
          <View style={styles.innerContainer}>
            <View style={styles.leftContainer}>
              <AppText
                style={{
                  fontFamily: "OpenSans_600SemiBold",
                  color: colors.text,
                }}
              >
                {item.name}
              </AppText>
              <AppText style={{ color: colors.textLight }}>fast</AppText>
            </View>
            <View style={styles.rightContainer}>
              <View
                style={[
                  styles.queueContainer,
                  { backgroundColor: colors.chargerList },
                ]}
              >
                <AppText
                  style={{ fontSize: 15, marginTop: -2, color: colors.text }}
                >
                  {item.queue.length}
                </AppText>

                <AppText
                  style={{ marginTop: -4, fontSize: 10, color: colors.text }}
                >
                  Queue
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
  );
}

const styles = StyleSheet.create({
  container: {
    elevation: 0,
    width: "100%",
    height: hp("9%"),
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
    width: wp("1.5%"),
    height: "70%",
    elevation: 5,
    borderRadius: wp("10%"),
    backgroundColor: "orange",
    alignSelf: "flex-end",
  },
});

export default HomeChargerList;
