import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import AppText from "./AppText";
import Modal from "react-native-modal";
import { Card } from "react-native-paper";
import Screen from "./Screen";
import { FormField } from "./forms";
import { Form } from "formik";
import AppTextInput from "./TextInput";
import Logo from "./Logo";
import AppButton from "./AppButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { color } from "react-native-reanimated";
import { useTheme } from "@react-navigation/native";

function ForgetPasswordDialog({ isModalVisible, setVisible }) {
  const { colors } = useTheme();

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
      <Card style={styles.modelCard}>
        <View>
          <View style={{}}>
            <Logo topFontsize={25} bottomFontsize={40} veho={colors.negative} />
          </View>
          <AppText style={[styles.title, { color: colors.negative }]}>
            Foreget Password ?
          </AppText>
          <AppText style={[styles.subtitle, { color: colors.text }]}>
            Enter the email address associated with your account
          </AppText>
          <View style={styles.inputText}>
            <AppTextInput
              autoCapitalize="none"
              autoCorrect={false}
              icon="email"
              keyboardType="email-address"
              placeholder="Email"
              textContentType="emailAddress"
            />
          </View>
          <View style={styles.button}>
            <AppButton title="Reset Password" />
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

  inputText: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  button: {
    marginHorizontal: 20,
  },
  keyboardAware: {
    flex: 1,
  },
});

export default ForgetPasswordDialog;
