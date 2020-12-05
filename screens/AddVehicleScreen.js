import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";

import AppText from "../components/AppText";
import * as Yup from "yup";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import { useTheme } from "@react-navigation/native";
import Screen from "../components/Screen";
import { Appbar } from "react-native-paper";
import { AppAuthContext } from "../context/AppAuthContext";
import useApi from "../hooks/useApi";
import { addVehicle } from "../Api/DbRequests";
import UploadScreen from "./UploadScreen";
import ActivityIndicator from "../components/ActivityIndicator";

const validationSchema = Yup.object().shape({
  vin: Yup.string().required().label("VIN number"),
  vehicleName: Yup.string().required().label("vehicle name"),
});

function AddVehicleScreen({ navigation }) {
  const [loginErrorVisible, setLoginErrorVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);

  const addVehicleApi = useApi(addVehicle);
  const { user } = useContext(AppAuthContext);
  const { colors } = useTheme();

  const handleSubmit = async (vehicleInfo) => {
    vehicleInfo.ownerId = user.userId;
    console.log(vehicleInfo);
    const result = await addVehicleApi.request(vehicleInfo);
    if (!result.error) {
      setUploadVisible(true);
    }
  };

  if (addVehicleApi.loading) {
    return <ActivityIndicator visible={true} />;
  }
  return (
    <View style={styles.container}>
      <Appbar.Header style={{ width: "100%" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add vehicle" />
      </Appbar.Header>
      <View style={styles.formContainer}>
        <UploadScreen
          onDone={() => {
            setUploadVisible(false);
            navigation.goBack();
          }}
          visible={uploadVisible}
        />
        <Form
          initialValues={{ vin: "", vehicleName: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            name="vin"
            placeholder="vehicle VIN number"
          />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            name="vehicleName"
            placeholder="Name the vehicle"
          />
          <ErrorMessage
            visible={loginErrorVisible}
            error="Invalid login credential"
          />

          <SubmitButton title="Add" />
        </Form>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    marginTop: 30,
    width: "90%",
    alignItems: "center",

    flex: 1,
  },
});

export default AddVehicleScreen;
