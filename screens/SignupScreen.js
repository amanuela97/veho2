import React, { useState } from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import CategoryPickerItem from "../components/CategoryPickerItem";
import AppPicker from "../components/Picker";
import PhoneInput from "react-native-phone-number-input";
import Logo from "../components/Logo";
import AppText from "../components/AppText";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PickerItem from "../components/PickerItem";
import { View } from "native-base";
import * as Animatable from "react-native-animatable";
import { registerUser } from "../Api/AppAuth";
import useApi from "../hooks/useApi";
import ActivityIndicator from "../components/ActivityIndicator";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});
const categories = [
  {
    itemName: "Veho vantaa",
  },
  {
    itemName: "Veho espoo",
  },
  {
    itemName: "Company X",
  },
  {
    itemName: "Company y",
  },
  {
    itemName: "Company xx",
  },
];

function SignupScreen() {
  const registerApi = useApi(registerUser);
  const [value, setValue] = useState();
  const [pickedItem, setPickedItem] = useState("Vanta Veho");
  const [error, setError] = useState();

  const handlePickerSelection = (item) => {
    setPickedItem(item.itemName);
  };

  const handleRegister = async (userInfo) => {
    setError("");
    userInfo.company = pickedItem;
    userInfo.phoneNumber = value;
    const result = await registerApi.request(userInfo);
    if (result.error) {
      setError(result.data);
      console.log("the error", error);
    }
    if (!result.error) {
      setError("");
    }
  };

  return (
    <>
      <ActivityIndicator visible={registerApi.loading} />
      <Screen style={styles.container}>
        <Animatable.View
          animation="slideInUp"
          duration={1000}
          style={{ flex: 1 }}
        >
          <KeyboardAwareScrollView style={styles.keyboardAware}>
            <AppText style={styles.register}>Register</AppText>
            <Form
              initialValues={{ name: "", email: "", password: "" }}
              onSubmit={handleRegister}
              validationSchema={validationSchema}
            >
              <AppPicker
                icon="format-list-checkbox"
                items={categories}
                numberOfColumns={1}
                PickerItemComponent={PickerItem}
                onSelectItem={handlePickerSelection}
                placeholder={
                  pickedItem.length < 1 ? " Select Company" : pickedItem
                }
                width="100%"
              />
              <FormField
                autoCorrect={false}
                icon="account"
                name="name"
                placeholder="Name"
              />
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

              <PhoneInput
                placeholder="Enter phone number"
                value={value}
                onChangeFormattedText={(item) => setValue(item)}
              />
              <View style={styles.button}>
                <SubmitButton title="Register" />
              </View>
            </Form>
            <ErrorMessage error={error} visible={error} />
          </KeyboardAwareScrollView>
        </Animatable.View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  register: {
    fontFamily: "OpenSans_700Bold",
    fontSize: 20,
    padding: 20,
  },

  keyboardAware: {
    flex: 1,
  },
  button: {
    paddingTop: 10,
  },
});
export default SignupScreen;
