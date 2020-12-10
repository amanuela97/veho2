import React, { useContext, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";

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
import { addVehicle, handleAddCar } from "../Api/DbRequests";
import UploadScreen from "./UploadScreen";
import ActivityIndicator from "../components/ActivityIndicator";
<<<<<<< HEAD
import { Picker } from "@react-native-picker/picker";
import i18n from 'i18n-js';
=======
import { db_auth } from "../Api/Db";
>>>>>>> f76e62f835069811be6baafbebee3d3f41bd708e

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
  const addVehicleDataApi = useApi(addVehicle);
  const { user } = useContext(AppAuthContext);
  const { colors } = useTheme();

  const handleSubmit = async (vehicleInfo) => {
    // if vin and plate fields are both empty return

    if (!vehicleInfo.licensePlate && !vehicleInfo.vin) {
      return;
    }
    const result = await addVehicleApi.request(vehicleInfo, picker);
    console.log("nowwwwww", result);
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
        `${picker} is invalid`,
        "Register vehicle anyways?",
        [
          {
            text: "Yes",
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
            text: "No",
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
            placeholder={i18n.t("vehicleName")}
          />
<<<<<<< HEAD
          <View style={{ marginVertical: 10, height: 150, overflow: "hidden" }}>
            <Picker
              selectedValue={picker}
              style={{ backgroundColor: colors.background }}
              itemStyle={{ backgroundColor: colors.header }}
              onValueChange={(itemValue, itemIndex) => {
                setPicker(itemValue);
              }}
            >
              <Picker.Item
                label={i18n.t("licensePlateNumber")}
                value="licensePlate"
                color="red"
              />
              <Picker.Item label="vin" value="vin" color="red" />
            </Picker>
          </View>

=======
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
>>>>>>> f76e62f835069811be6baafbebee3d3f41bd708e
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
<<<<<<< HEAD
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
=======
          <SubmitButton title="Add" />
>>>>>>> f76e62f835069811be6baafbebee3d3f41bd708e
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
