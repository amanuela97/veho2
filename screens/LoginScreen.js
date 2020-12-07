import React, { useContext, useState } from "react";
import { StyleSheet, Image } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import { View } from "native-base";
import Logo from "../components/Logo";
import AppText from "../components/AppText";
import { TouchableOpacity } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import { Card, Colors } from "react-native-paper";
import ForgetPasswordDialog from "../components/ForgetPasswordDialog";
import AppButton from "../components/AppButton";
import { useTheme } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import { result } from "validate.js";
import useApi from "../hooks/useApi";
import { loginUser } from "../Api/AppAuth";
import { db_auth } from "../Api/Db";
import { AuthContextMain } from "../context/AppAuthContextMain";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const { login } = useContext(AuthContextMain);
  const [loginErrorVisible, setLoginErrorVisible] = useState(false);
  const { colors } = useTheme();
  const loginApi = useApi(login);
  console.log("presssed");

  console.log(db_auth.currentUser);

  const handleSubmit = async (userInfo) => {
    setLoginErrorVisible(false);
    const result = await loginApi.request(userInfo);

    setLoginErrorVisible(result.error);
  };
  return (
    <Screen style={styles.container}>
      <Animatable.View
        animation="zoomInDown"
        duration={2000}
        style={styles.header}
      >
        <Logo veho={colors.negative} />
      </Animatable.View>
      <Animatable.View
        animation="zoomInUp"
        duration={2000}
        style={styles.footer}
      >
        <AppText style={styles.login}>Welcome!</AppText>
        <Form
          initialValues={{ email: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
          />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="password"
            placeholder="Password"
            secureTextEntry
            textContentType="password"
          />
          <ErrorMessage
            visible={loginErrorVisible}
            error="Invalid login credential"
          />
          <TouchableOpacity
            style={styles.forgetPassword}
            onPress={() => setModalVisible(true)}
          >
            <AppText style={[{ color: colors.primary }]}>
              Forget Password ?
            </AppText>

            <ForgetPasswordDialog
              isModalVisible={modalVisible}
              setVisible={setModalVisible}
            />
          </TouchableOpacity>

          <SubmitButton title="Login" />
          <AppButton
            title="signup"
            onPress={() => navigation.navigate("Signup")}
          />
        </Form>
      </Animatable.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: Colors.text,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  header: {
    flex: 1,
    justifyContent: "center",
  },
  footer: {
    flex: 3,
  },
  login: {
    fontFamily: "OpenSans_700Bold",
    fontSize: 20,
  },

  forgetPassword: {
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: 10,
  },
  modelCard: {
    height: "50%",
    width: "100%",
  },
});

export default LoginScreen;
