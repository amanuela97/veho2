import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import AppText from "./AppText";
import Modal from "react-native-modal";
import { Card, TextInput } from "react-native-paper";
import { ErrorMessage } from "./forms";
import Logo from "./Logo";
import AppButton from "./AppButton";
import { useTheme } from "@react-navigation/native";
import useApi from "../hooks/useApi";
import { forgerPassword } from "../Api/AppAuth";
import i18n from "i18n-js";

function ForgetPasswordDialog({ isModalVisible, setVisible }) {
  const { colors } = useTheme();

  const forgerPasswordApi = useApi(forgerPassword);
  const [errors, setErrors] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [userInfo, setUserInfo] = useState("");
  const handleForgetPassword = async (email) => {
    setErrors("");
    setErrorVisible(false);
    if (email?.length > 10 && email !== undefined) {
      const reset = await forgerPasswordApi.request(email);

      if (reset.error) {
        setErrors(reset.data);
        setErrorVisible(true);
        return;
      }
      setConfirmed(true);
      return;
    }
    setErrors(i18n.t("invalidEmail"));
    setErrorVisible(true);
  };

  if (confirmed) {
    return (
      <Modal
        testID={"modal"}
        isVisible={isModalVisible}
        avoidKeyboard={true}
        animationInTiming={600}
        onBackdropPress={() => {
          setVisible(false);
          setConfirmed(false);
        }}
        onSwipeComplete={() => {
          setVisible(false);
          setConfirmed(false);
        }}
        swipeDirection="left"
        onBackdropPress={() => {
          setVisible(false);
          setConfirmed(false);
        }}
        animationOutTiming={1000}
        backdropTransitionInTiming={800}
        backdropTransitionOutTiming={800}
      >
        <Card style={styles.modelCardC}>
          <View>
            <AppText style={[styles.title, { color: colors.negative }]}>
              {i18n.t("success")}
            </AppText>
            <AppText style={[styles.subtitle, { color: colors.text }]}>
              {i18n.t("linkToResetPasswordSenttoEmail")}
            </AppText>
          </View>
        </Card>
      </Modal>
    );
  }

  return (
    <Modal
      testID={"modal"}
      isVisible={isModalVisible}
      avoidKeyboard={true}
      animationInTiming={600}
      onBackdropPress={() => {
        setVisible(false);
        setConfirmed(false);
      }}
      onSwipeComplete={() => {
        setVisible(false);
        setConfirmed(false);
      }}
      swipeDirection="left"
      onBackdropPress={() => {
        setVisible(false);
        setConfirmed(false);
      }}
      animationOutTiming={1000}
      backdropTransitionInTiming={800}
      backdropTransitionOutTiming={800}
    >
      <Card style={styles.modelCard}>
        <View>
          <View style={{}}>
            <Logo topFontsize={25} bottomFontsize={40} veho={colors.negative} />
          </View>
          <AppText style={[styles.title, { color: colors.negative }]}>
            {i18n.t("Forget")} {i18n.t("Password")}?
          </AppText>
          <AppText style={[styles.subtitle, { color: colors.text }]}>
            {i18n.t("enterTheEmailAddeessAssociatedWithYourAccount")}
          </AppText>
          <View style={styles.inputText}>
            <TextInput
              style={[
                styles.textInput,
                { color: colors.text, backgroundColor: colors.header },
              ]}
              placeholder={i18n.t("emailAddress")}
              clearButtonMode="while-editing"
              placeholderTextColor={colors.textLight}
              autoCorrect={false}
              autoCapitalize="none"
              maxLength={30}
              onChangeText={(item) => setUserInfo(item)}
            />
          </View>
          <View style={styles.button}>
            <ErrorMessage visible={errorVisible} error={errors} />
            <AppButton
              title={i18n.t("resetPassword")}
              onPress={() => handleForgetPassword(userInfo)}
            />
          </View>
        </View>
      </Card>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  forgetPassword: {
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: 10,
  },
  modelCard: {
    width: "100%",
    height: 500,
    paddingTop: "10%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modelCardC: {
    width: "100%",
    height: 200,
    paddingTop: "10%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "OpenSans_700Bold",
    fontSize: 25,
    marginVertical: 15,
    alignSelf: "center",
  },
  subtitle: {
    fontFamily: "OpenSans_300Light",
    margin: 15,
    marginRight: 40,
    marginLeft: 40,
    marginTop: 0,
  },

  textInput: {
    width: "90%",
    alignSelf: "center",
    height: 40,
    padding: 10,
  },
  button: {
    marginHorizontal: 20,
  },
  keyboardAware: {
    flex: 1,
  },
});

export default ForgetPasswordDialog;
