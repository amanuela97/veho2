import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  Platform,
  acceptQueue,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Swipeable from "react-native-gesture-handler/Swipeable";

import AppText from "../AppText";
import { useTheme } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { Card } from "react-native-paper";
import LottieView from "lottie-react-native";
import CircularProgress from "../CircularProgress";
import { color } from "react-native-reanimated";
import i18n from 'i18n-js';

function ListItemCar({
  title,
  subTitle,
  image,
  carInfo,
  IconComponent,
  onPress,
  connected,
  renderRightActions,
  renderLeftActions,
  chevron = true,
  backgroundColor = "#fff",
  AndroidIcon,
  acceptQueue,
}) {
  const { colors } = useTheme();

  const status = (carInfo) => {
    if (carInfo.chargingStatus === "0") {
      return i18n.t("Vehicleischarging");
    } else if (carInfo.chargingStatus === "1") {
      return i18n.t("EndofCharge");
    } else if (carInfo.chargingStatus === "2") {
      return i18n.t("Chargebreak");
    } else if (carInfo.chargingStatus === "3") {
      return i18n.t("Chargecableunplugged");
    } else if (carInfo.chargingStatus === "4") {
      return i18n.t("Chargingfailure");
    } else if (carInfo.chargingStatus === "5") {
      return i18n.t("SlowCharging");
    } else if (carInfo.chargingStatus === "6") {
      return i18n.t("FastCharging");
    } else if (carInfo.chargingStatus === "7") {
      return i18n.t("Discharging");
    } else if (carInfo.chargingStatus === "8") {
      return i18n.t("Nocharging");
    } else if (carInfo.chargingStatus === "9") {
      return i18n.t("Chargingforeignobjectdetection");
    } else {
      return i18n.t("vehiclenotconnected");
    }
  };
  const vhcStatus = status(carInfo);
  if (!connected) {
    return (
      <Swipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
      >
        <TouchableHighlight underlayColor={colors.background} onPress={onPress}>
          <View style={{ borderRadius: 20, backgroundColor: colors.vehicle }}>
            <View
              style={[styles.container, { backgroundColor: colors.vehicle }]}
            >
              {Platform.OS === "ios" ? IconComponent : AndroidIcon}
              {image && <Image style={styles.image} source={image} />}
              <View
                style={[
                  styles.detailsContainer,
                  { backgroundColor: colors.vehicle },
                ]}
              >
                <AppText
                  style={[styles.title, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {title}
                </AppText>

                <AppText style={[styles.subTitle]}>{vhcStatus}</AppText>
              </View>

              <CircularProgress battery={0} />
            </View>
            {carInfo.assigned && (
              <View style={styles.statusContainerAssigned}>
                <AppText style={styles.queueStat}>{i18n.t("queueStatus")}</AppText>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <AppText style={styles.assign}>{i18n.t("assignedTo")}</AppText>
                  <AppText style={styles.name}>{carInfo.chargerName}</AppText>
                </View>
              </View>
            )}
            {carInfo.waitingConfirmation && (
              <View style={styles.statusContainer} onPress={acceptQueue}>
                <View>
                  <LottieView
                    autoPlay
                    loop={true}
                    source={require("../../assets/waiting.json")}
                    style={{ width: 60, height: 60 }}
                  />
                </View>
                <AppText style={styles.queueStat}>{i18n.t("clickToAccept")}</AppText>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <AppText
                    style={{
                      fontFamily: "OpenSans_600SemiBold",
                      fontSize: 12,
                    }}
                  >
                    {i18n.t("waitingConfirmation")}
                  </AppText>
                  <AppText style={styles.name}>{carInfo.chargerName}</AppText>
                </View>
              </View>
            )}

            {carInfo.queue && (
              <View style={styles.statusContainerQueue}>
                <AppText style={styles.queueStatQ}>{i18n.t("vehicleOnQueue")}</AppText>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <AppText
                    style={{
                      fontFamily: "OpenSans_700Bold",
                      fontSize: 18,
                      color: "white",
                    }}
                  >
                    {carInfo.position}
                  </AppText>
                  <AppText style={{ fontSize: 12, color: "white" }}>
                  {i18n.t("position")}
                  </AppText>
                </View>
              </View>
            )}
          </View>
        </TouchableHighlight>
      </Swipeable>
    );
  }
  if (connected) {
    return (
      <Swipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
      >
        <TouchableHighlight underlayColor={colors.background} onPress={onPress}>
          <View style={{ borderRadius: 20, backgroundColor: colors.vehicle }}>
            <View
              style={[
                styles.container,
                { backgroundColor: colors.vehicle, borderRadius: 20 },
              ]}
            >
              {Platform.OS === "ios" ? IconComponent : AndroidIcon}
              {image && <Image style={styles.image} source={image} />}
              <View
                style={[
                  styles.detailsContainer,
                  { backgroundColor: colors.vehicle },
                ]}
              >
                <AppText
                  style={[styles.title, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {title}
                </AppText>

                <AppText style={[styles.subTitleCon]}>{vhcStatus}</AppText>
              </View>

              {connected && <CircularProgress battery={carInfo.soc} />}
            </View>
            {carInfo.assigned && (
              <View style={styles.statusContainerAssigned}>
                <AppText style={styles.queueStat}>{i18n.t("queueStatus")}</AppText>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <AppText style={styles.assign}>{i18n.t("assignedTo")}</AppText>
                  <AppText style={styles.name}>{carInfo.chargerName}</AppText>
                </View>
              </View>
            )}
            {carInfo.waitingConfirmation && (
              <View style={styles.statusContainer} onPress={acceptQueue}>
                <View>
                  <LottieView
                    autoPlay
                    loop={true}
                    source={require("../../assets/waiting.json")}
                    style={{ width: 60, height: 60 }}
                  />
                </View>
                <AppText style={styles.queueStat}>{i18n.t("clickToAccept")}</AppText>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <AppText
                    style={{ fontFamily: "OpenSans_600SemiBold", fontSize: 12 }}
                  >
                    {i18n.t("waitingConfirmation")}
                  </AppText>
                  <AppText style={styles.name}>{carInfo.chargerName}</AppText>
                </View>
              </View>
            )}

            {carInfo.queue && (
              <View style={styles.statusContainerQueue}>
                <AppText style={styles.queueStatQ}>{i18n.t("vehicleOnQueue")}</AppText>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <AppText
                    style={{
                      fontFamily: "OpenSans_700Bold",
                      fontSize: 18,
                      color: "white",
                    }}
                  >
                    {carInfo.position}
                  </AppText>
                  <AppText style={{ fontSize: 12, color: "white" }}>
                  {i18n.t("position")}
                  </AppText>
                </View>
              </View>
            )}
          </View>
        </TouchableHighlight>
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    paddingLeft: 10,
    paddingVertical: 20,
    borderRadius: 20,
  },
  queueContainer: {
    height: 60,
    width: 60,
    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",
  },
  assign: { fontFamily: "OpenSans_600SemiBold", fontSize: 12, color: "white" },
  name: {
    fontFamily: "OpenSans_600SemiBold",
    fontSize: 12,
  },
  statusContainer: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#f4b860",
    borderRadius: 10,
  },
  statusContainerAssigned: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#00adef",
    borderRadius: 10,
  },
  statusContainerQueue: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#3d348b",
    borderRadius: 10,
  },
  queueStat: {
    fontFamily: "OpenSans_600SemiBold",
    fontSize: 14,
    color: "white",
  },
  queueStatQ: {
    fontFamily: "OpenSans_600SemiBold",
    color: "white",
  },
  queueContainerCard: {
    height: 60,
    width: 60,
    borderRadius: 20,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  subTitle: {
    fontSize: 10,
    fontFamily: "OpenSans_700Bold",
    color: "tomato",
  },
  subTitleCon: {
    fontSize: 12,
    fontFamily: "OpenSans_700Bold",
    color: "green",
  },
  title: {
    fontFamily: "OpenSans_600SemiBold",
  },
});

export default ListItemCar;
