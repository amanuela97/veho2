import React, { useContext, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";

import * as Yup from "yup";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import { Appbar, RadioButton, Text } from "react-native-paper";
import useApi from "../hooks/useApi";
import { addVehicle, handleAddCar } from "../Api/DbRequests";
import UploadScreen from "./UploadScreen";
import ActivityIndicator from "../components/ActivityIndicator";
import i18n from "i18n-js";
import { db_auth } from "../Api/Db";

const validationSchema = Yup.object().shape({
  vehicle: Yup.string().required().min(4).label("vehicle"),
  vin: Yup.string().min(17).max(17).label("vin"),
  licensePlate: Yup.string().min(7).label("licensePlate"),
});

function AddVehicleScreen({ navigation }) {
  const [loginErrorVisible, setLoginErrorVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [picker, setPicker] = useState("licensePlate");
  const addVehicleApi = useApi(handleAddCar);
  const addVehicleDataApi = useApi(addVehicle);

  const handleSubmit = async (vehicleInfo) => {
    // if vin and plate fields are both empty return

    if (!vehicleInfo.licensePlate && !vehicleInfo.vin) {
      return;
    }
    const result = await addVehicleApi.request(vehicleInfo, picker);
    const vehicleDa = result.data;
    if (!result.error && vehicleDa.carInfo !== undefined) {
      //   const vehicleD = addVehicleDataApi.request(vehicleInfo,)
      const vehicleD = await addVehicleDataApi.request(
        vehicleInfo,
        vehicleDa.vin,
        vehicleDa.carInfo,
        db_auth.currentUser.uid,
        true
      );
      console.log(vehicleD);
      setUploadVisible(true);
      return;
    }
    if (!result.error && vehicleDa.catInfo === undefined) {
      Alert.alert(
        `${
          picker === "licensePlate"
            ? i18n.t("licensePlateNumber")
            : i18n.t("vinNumber")
        } ${i18n.t("isValid")}`,
        i18n.t("registerAnyway"),
        [
          {
            text: i18n.t("Yes"),
            onPress: async () => {
              const vehicleD = await addVehicleDataApi.request(
                vehicleInfo,
                vehicleDa.vin,
                vehicleDa.carInfo,
                db_auth.currentUser.uid,
                false
              );
              setUploadVisible(true);
              return;
            },
          },
          {
            text: i18n.t("No"),
            onPress: () => {
              return;
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  if (addVehicleApi.loading || addVehicleDataApi.loading) {
    return <ActivityIndicator visible={true} />;
  }
  return (
    <View style={styles.container}>
      <Appbar.Header style={{ width: "100%" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={i18n.t("addVehicle")} />
      </Appbar.Header>
      <View style={styles.formContainer}>
        <UploadScreen
          onDone={() => {
            console.log("ddddddddbbbbbdddduuuuudddd");
            setUploadVisible(false);
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
            placeholder={i18n.t("vehicleName")}
          />
          <RadioButton.Group
            onValueChange={(newValue) => setPicker(newValue)}
            value={picker}
          >
            <View style={styles.RadioButtonStyle}>
              <Text>{i18n.t("licensePlateNumber")}</Text>
              <RadioButton value="licensePlate" />
            </View>
            <View style={styles.RadioButtonStyle}>
              <Text>{i18n.t("vinNumber")}</Text>
              <RadioButton value="vin" />
            </View>
          </RadioButton.Group>
          {picker === "licensePlate" && (
            <FormField
              autoCorrect={false}
              icon="card"
              name="licensePlate"
              style={{ width: "80%" }}
              placeholder={i18n.t("licensePlateNumber")}
            />
          )}
          {picker === "vin" && (
            <FormField
              autoCorrect={false}
              icon="card"
              name="vin"
              placeholder={i18n.t("vinNumber")}
            />
          )}
          <ErrorMessage
            visible={loginErrorVisible}
            error="Invalid login credential"
          />
          {/*  <RadioButton.Group
            onValueChange={(newValue) => setValue(newValue)}
            value={value}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text>First</Text>
              <RadioButton value="first" />
            </View>
            <View>
              <Text>Second</Text>
              <RadioButton value="second" />
            </View>
          </RadioButton.Group> */}
          <SubmitButton title={i18n.t("add")} />
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
  RadioButtonStyle: {
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default AddVehicleScreen;
