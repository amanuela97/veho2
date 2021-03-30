import React, { useContext, useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import AppPicker from "../components/Picker";
import AppText from "../components/AppText";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PickerItem from "../components/PickerItem";
import { View } from "native-base";
import * as Animatable from "react-native-animatable";
import useApi from "../hooks/useApi";
import ActivityIndicator from "../components/ActivityIndicator";
import { AuthContextMain } from "../context/AppAuthContextMain";
import { useTheme } from "@react-navigation/native";
import i18n from "i18n-js";
import { getCompanyList } from "../Api/DbRequests";
import { db_store } from "../Api/Db";
import { StatusBar } from "expo-status-bar";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
  code: Yup.string().required().label("registration Code"),
});
const categories = [
  {
    itemName: "veho",
  },
];

function SignupScreen() {
  const [pickedItem, setPickedItem] = useState("veho airport");
  const [mounted, setMounted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [error, setError] = useState("");
  const { register } = useContext(AuthContextMain);
  const getCompanyListApi = useApi(getCompanyList);
  const { colors } = useTheme();
  const handlePickerSelection = (item) => {
    setPickedItem(item.name);
  };

  const displayCompanyList = async () => {
    const company = await getCompanyListApi.request();

    if (company.error) {
      setError(result.data);
    }
    if (!company.error) {
      setError("");
      await setCompanyList(company.data);
    }
  };

  const handleRegister = async (userInfo) => {
    if (userInfo.code !== `veho go charge ${pickedItem}`) {
      setError("unable to register");
      return;
    }

    setError("");
    userInfo.company = pickedItem;
    setLoading(true);
    const result = await register(userInfo);
    if (mounted) {
      if (result.error) {
        setLoading(false);
        setError(result.data);
        console.log("the error", error);
      }
    }
  };
  useEffect(() => {
    const collection = [];
    var docRef = db_store
      .collection("company")
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.map((doc) => {
          collection.push(doc.data());
        });
        setCompanyList(collection);
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
    return () => {
      setLoading(false);
      setMounted(false);
      setError("");
    };
  }, []);

  if (getCompanyListApi.loading || loading) {
    return <ActivityIndicator visible={true} />;
  }

  return (
    <Screen style={styles.container}>
      <StatusBar style={colors.light ? "dark" : "light"} />
      <Animatable.View
        animation="slideInUp"
        duration={1000}
        style={{ flex: 1 }}
      >
        <KeyboardAwareScrollView style={styles.keyboardAware}>
          <AppText style={styles.register}>{i18n.t("Register")}</AppText>
          <Form
            initialValues={{ name: "", email: "", password: "" }}
            onSubmit={handleRegister}
            validationSchema={validationSchema}
          >
            <AppPicker
              icon="format-list-checkbox"
              items={companyList}
              numberOfColumns={1}
              PickerItemComponent={PickerItem}
              onSelectItem={handlePickerSelection}
              backgroundColor={colors.header}
              placeholder={
                pickedItem.length < 1 ? " Select Company" : pickedItem
              }
              width="100%"
            />
            <FormField
              autoCorrect={false}
              icon="account"
              name="name"
              placeholder={i18n.t("Name")}
            />
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="email"
              keyboardType="email-address"
              name="email"
              placeholder={i18n.t("Email")}
              textContentType="emailAddress"
            />

            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="lock"
              name="password"
              placeholder={i18n.t("Password")}
              secureTextEntry
              textContentType="password"
            />
            <FormField
              autoCorrect={false}
              name="code"
              placeholder={i18n.t("registrationCode")}
            />

            <View style={styles.button}>
              <SubmitButton title={i18n.t("Register")} />
            </View>
          </Form>
          <ErrorMessage error={error} visible={error} />
        </KeyboardAwareScrollView>
      </Animatable.View>
    </Screen>
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
