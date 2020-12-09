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
import { Appbar, RadioButton, Text } from "react-native-paper";
import { AppAuthContext } from "../context/AppAuthContext";
import useApi from "../hooks/useApi";
import { handleAddCar } from "../Api/DbRequests";
import UploadScreen from "./UploadScreen";
import ActivityIndicator from "../components/ActivityIndicator";

const validationSchema = Yup.object().shape({
  vehicle: Yup.string().required().min(4).label("vehicle"),
  vin: Yup.string().min(17).max(17).label("vin"),
  licensePlate: Yup.string().min(7).label("licensePlate"),
});

function AddVehicleScreen({ navigation }) {
  const [loginErrorVisible, setLoginErrorVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [picker, setPicker] = useState("licensePlate");
  const [value, setValue] = React.useState("first");
  const addVehicleApi = useApi(handleAddCar);
  const { user } = useContext(AppAuthContext);
  const { colors } = useTheme();

  const handleSubmit = async (vehicleInfo) => {
    // if vin and plate fields are both empty return
    if (!vehicleInfo.licensePlate && !vehicleInfo.vin) {
      return;
    }
    const result = await addVehicleApi.request(vehicleInfo, picker);
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
            autoCorrect={false}
            icon="car"
            style={{ width: "80%" }}
            name="vehicle"
            placeholder="Vehicle Name"
          />
          <RadioButton.Group
            onValueChange={(newValue) => setPicker(newValue)}
            value={picker}
          >
            <View style={styles.RadioButtonStyle}>
              <Text>licensePlate</Text>
              <RadioButton value="licensePlate" />
            </View>
            <View style={styles.RadioButtonStyle}>
              <Text>vin</Text>
              <RadioButton value="vin" />
            </View>
          </RadioButton.Group>
          {picker === "licensePlate" && (
            <FormField
              autoCorrect={false}
              icon="card"
              name="licensePlate"
              style={{ width: "80%" }}
              placeholder="licensePlate"
            />
          )}
          {picker === "vin" && (
            <FormField
              autoCorrect={false}
              icon="card"
              name="vin"
              placeholder="Vin Number"
            />
          )}
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
    flex: 1,
  },
  RadioButtonStyle:{
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    alignItems: 'center',
  }
});

export default AddVehicleScreen;
