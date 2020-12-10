import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { createChargingQueue, getVehicles } from "../Api/DbRequests";
import ActivityIndicator from "../components/ActivityIndicator";
import AppButton from "../components/AppButton";
import AppPicker from "../components/Picker";
import PickerItem from "../components/PickerItem";
import { AppAuthContext } from "../context/AppAuthContext";
import useApi from "../hooks/useApi";
import UploadScreen from "./UploadScreen";

function CreateQueueScreen({ navigation }) {
  const [pickedItem, setPickedItem] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [uploadVisible, setUploadVisible] = useState(false);
  const { user } = useContext(AppAuthContext);

  const { colors } = useTheme();
  const getVehicleApi = useApi(getVehicles);
  const createQueueApi = useApi(createChargingQueue);
  const handlePickerSelection = (item) => {
    setPickedItem(item);
  };

  const handleGetVehicles = async () => {
    const vehiclesList = await getVehicleApi.request();
    if (!vehiclesList.error) {
      setVehicles(vehiclesList.data);
    }
  };

  const handleCreateQueue = async () => {
    const userId = user.userId;
    const userName = user.userName;
    const vehicleId = pickedItem.vehicleId ? pickedItem.vehicleId : "";
    const vehicleName = pickedItem.vehicleName ? pickedItem.vehicleName : "";
    const queue = await createQueueApi.request(
      userId,
      userName,
      vehicleId,
      vehicleName
    );
    if (!queue.error) {
      setUploadVisible(true);
    }
  };

  useEffect(() => {
    handleGetVehicles();
  }, []);

  if (getVehicleApi.loading || createQueueApi.loading) {
    return <ActivityIndicator visible={true} />;
  }
  return (
    <View style={styles.container}>
      <UploadScreen
        onDone={() => {
          setUploadVisible(false);
          //navigation.goBack();
        }}
        visible={uploadVisible}
      />
      <AppPicker
        icon="car-electric"
        items={vehicles}
        numberOfColumns={1}
        PickerItemComponent={PickerItem}
        onSelectItem={handlePickerSelection}
        placeholder={pickedItem.length < 1 ? " Select Car" : pickedItem.name}
        width="100%"
        backgroundColor={colors.header}
      />

      <AppButton
        title="check in to this queue"
        onPress={() => handleCreateQueue()}
        color={colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default CreateQueueScreen;
