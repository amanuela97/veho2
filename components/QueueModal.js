import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import AppText from "./AppText";
import Modal from "react-native-modal";
import { Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppTextInput from "./TextInput";
import Logo from "./Logo";
import AppButton from "./AppButton";
import { useTheme } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { cancelQueue } from "../Api/DbRequests";
import useApi from "../hooks/useApi";
function QueueModal({ isModalVisible, setVisible, item }) {
  const cancelQueueApi = useApi(cancelQueue);
  const { colors } = useTheme();

  const cancelQueueFun = async () => {
    setVisible(false);
    const queue = await cancelQueueApi.request(
      item.chargerId,
      item.queueObject
    );
  };

  const handleCancelQueue = async () => {
    Alert.alert(
      "Cancel A Queue",
      "Are you sure You want to cancel this Queue",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            cancelQueueFun();
          },
        },
      ],
      { cancelable: false }
    );
  };
  console.log(cancelQueueApi.data);
  return (
    <Modal
      testID={"modal"}
      isVisible={isModalVisible}
      avoidKeyboard={true}
      animationInTiming={600}
      onBackdropPress={() => setVisible(false)}
      onSwipeComplete={() => setVisible(false)}
      swipeDirection="left"
      onBackdropPress={() => setVisible(false)}
      animationOutTiming={1000}
      backdropTransitionInTiming={800}
      backdropTransitionOutTiming={800}
    >
      <View style={[styles.modelCard, { backgroundColor: colors.header }]}>
        <View>
          <View style={{}}>
            <AppText style={[styles.title, { color: colors.negative }]}>
              Hi {item.queueObject.userName}
            </AppText>
            <AppText style={[styles.subtitle, { color: colors.negative }]}>
              Thank you for waiting
            </AppText>
          </View>

          <View style={styles.waiting}>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={40}
              color={colors.secondary}
            />
          </View>

          <AppText style={[styles.content, { color: colors.negative }]}>
            here is your position in the queue
          </AppText>

          <View style={styles.queueContainer}>
            <AppText
              style={{ fontSize: hp("5%"), marginTop: -2, color: "white" }}
            >
              {item.queue}
            </AppText>

            <AppText
              style={{ marginTop: -4, fontSize: hp("2%"), color: "white" }}
            >
              Position
            </AppText>
          </View>
          <View style={styles.button}>
            <AppButton
              title="cancel Queue"
              color="tomato"
              onPress={() => handleCancelQueue()}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  forgetPassword: {
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: 10,
  },
  modelCard: {
    width: "100%",
    height: hp("70%"),
    paddingTop: "10%",
    borderRadius: 20,

    alignItems: "center",
  },
  title: {
    fontFamily: "OpenSans_700Bold",
    fontSize: 25,
    marginVertical: 10,
    alignSelf: "center",
  },
  subtitle: {
    fontSize: 22,
    marginVertical: 2,
    alignSelf: "center",
    justifyContent: "center",
  },
  queueContainer: {
    backgroundColor: "#16161d",
    height: hp("16%"),
    width: hp("16%"),
    marginTop: hp("4%"),
    borderRadius: hp("8%"),
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  content: {
    fontSize: "OpenSans_300Light",
    fontSize: 15,
    marginTop: hp("5%"),
    alignSelf: "center",
    justifyContent: "center",
  },
  waiting: {
    alignItems: "center",
  },
  button: {
    alignSelf: "stretch",
    marginTop: hp("4%"),
  },
  keyboardAware: {
    flex: 1,
  },
});

export default QueueModal;
