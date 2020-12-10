import { useTheme } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Alert } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Appbar } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import {
  getVehicles,
  deleteVehicle,
  createChargingQueue,
  updateVehicle,
  cancelQueue,
  updateVehicleSingleInfo,
} from "../Api/DbRequests";
import ActivityIndicator from "../components/ActivityIndicator";
import AppText from "../components/AppText";
import Icon from "../components/Icon";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import { AppAuthContext } from "../context/AppAuthContext";
import useApi from "../hooks/useApi";
import UploadScreen from "./UploadScreen";
import { FontAwesome5 } from "@expo/vector-icons";
import { Card } from "react-native-paper";
import { fetchCarDetails, fetchToken } from "../Api/CarApi";
import { db_store, db_auth } from "../Api/Db";
import ListItemCar from "../components/lists/ListItemCar";
import ListItemAddQueueAction from "../components/lists/ListItemAddQueueAction ";
import CarAnim from "./CarAnim";
import useNotifications from "../hooks/useNotifications";
import AppButton from "../components/AppButton";
import { result } from "validate.js";
import i18n from 'i18n-js';

function VehicleStatus({ navigation }) {
  const [error, setError] = useState();
  const [vehicles, setVehicles] = useState([]);
  const [searchVehicles, setSearchVehicles] = useState([]);
  const [uploadVisible, setUploadVisible] = useState(false);
  const { user } = useContext(AppAuthContext);

  const getVehicleApi = useApi(getVehicles);
  const deleteVehicleApi = useApi(deleteVehicle);
  const { colors } = useTheme();
  const createQueueApi = useApi(createChargingQueue);
  const cancelQueueApi = useApi(cancelQueue);
  const acceptQueueApi = useApi(updateVehicleSingleInfo);
  useNotifications();
  const handleGetVehicles = async () => {
    console.log("caledd");
    const vehiclesList = await getVehicleApi.request();
    await setVehicles(vehiclesList.data);
    setSearchVehicles(vehiclesList.data);
  };


  const handleDeleteVehicles = async (item) => {
    if (item.queue || item.waitingConfirmation || item.assigned) {
      Alert.alert(
        i18n.t("vehicleOnQueue"),
        i18n.t("pleaseSwipeToRight"),

        { cancelable: true }
      );
    } else {
      const vehiclesList = await deleteVehicleApi.request(item);
      if (!vehiclesList.error) {
        setVehicles(vehiclesList.data);
        setSearchVehicles(vehiclesList.data);
        setUploadVisible(true);
      }
    }
  };

  const handleCreateQueue = async (vehicle) => {
    const queue = await createQueueApi.request(vehicle, user);
    if (!queue.error) {
      setUploadVisible(true);
    }
  };
  const handleCancelQueue = async (vehicle) => {
    const queue = await cancelQueueApi.request(vehicle);
    if (!queue.error) {
      setUploadVisible(true);
    }
  };

  const handleVehicleOnPress = async (vehicle) => {
    if (vehicle.waitingConfirmation) {
      const update = await acceptQueueApi.request(
        vehicle.vehicleId,
        false,
        true,
        false,
        vehicle.chargerName,
        vehicle.chargerId,
        0
      );
    }
  };

  useEffect(() => {
    const unsubscribeVehicle = db_store
      .collection("vehicle")
      .where("ownerId", "==", db_auth.currentUser.uid)
      .onSnapshot((snapshot) => {
        const newList = [];
        snapshot.forEach((doc) => {
          newList.push(doc.data());
        });
        setVehicles(newList);
      });

    handleGetVehicles();

    return () => {
      unsubscribeVehicle();
    };
  }, []);

  const handleSearch = (text) => {
    const userInput = text.toLowerCase();
    const newList = searchVehicles.filter((vehicle) =>
      vehicle.name.toLowerCase().includes(userInput)
    );
    setVehicles(newList);
  };

  if (
    getVehicleApi.loading ||
    deleteVehicleApi.loading ||
    createQueueApi.loading ||
    acceptQueueApi.loading ||
    cancelQueueApi.loading
  ) {
    return <ActivityIndicator visible={true} />;
  }
  return (
    <View style={[styles.container]}>
      {colors.light ? <StatusBar style="dark" /> : <StatusBar style="light" />}
      <Appbar.Header
        style={{
          width: "100%",
          backgroundColor: colors.header,
          zIndex: 12,
          elevation: 0,
          height: 40,
        }}
      >
        <Appbar.Content title={i18n.t("vehicles")} />
      </Appbar.Header>
      <ListItemSeparator />
      <View
        style={[
          styles.mainContainer,
          { backgroundColor: colors.vehicleStatus },
        ]}
      >
        <View style={styles.searchContainer}>
          <View>
            <AppText style={[styles.sectionTitle, { color: colors.text }]}>
            {i18n.t("vehiclesCollection")}
            </AppText>
          </View>
          <Card style={styles.textInputCard}>
            <View style={styles.textInputInner}>
              <View style={styles.iconContainer}>
                <FontAwesome5
                  name="searchengin"
                  size={20}
                  color={colors.textLight}
                />
              </View>
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                placeholder={i18n.t("searchAVehicle")}
                clearButtonMode="while-editing"
                placeholderTextColor={colors.textLight}
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(item) => handleSearch(item)}
              />
            </View>
          </Card>
        </View>
        {vehicles !== undefined && vehicles.length > 0 && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={vehicles}
            keyExtractor={(vehicle) => vehicle.vehicleId}
            renderItem={({ item }) => (
              <View
                style={{
                  marginVertical: 8,
                  elevation: 1,
                  padding: 6,
                  borderRadius: 20,
                  backgroundColor: colors.vehicleStatus,
                }}
              >
                <ListItemCar
                  title={item.name}
                  carInfo={item}
                  subTitle={item.soc ? item.soc : "battery status"}
                  connected={item.connected ? item.connected : false}
                  chevron={false}
                  AndroidIcon={<Icon name="car-electric" />}
                  IconComponent={<CarAnim autoPlayAnim={item.chargingActive} />}
                  backgroundColor={colors.header}
                  onPress={() => handleVehicleOnPress(item)}
                  renderRightActions={() => (
                    <ListItemDeleteAction
                      onPress={() => handleDeleteVehicles(item)}
                    />
                  )}
                  renderLeftActions={() => (
                    <ListItemAddQueueAction
                      vehicleQueue={item.queue}
                      confirmation={item.waitingConfirmation}
                      assigned={item.assigned}
                      onPress={() => handleCreateQueue(item)}
                      onPressCancel={() => handleCancelQueue(item)}
                    />
                  )}
                />
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontFamily: "OpenSans_600SemiBold",
    fontSize: 20,
    marginVertical: 20,
    paddingLeft: 5,
  },
  textInputCard: { elevation: 1, borderRadius: 10 },

  textInputInner: { flexDirection: "row", width: "100%" },
  iconContainer: {
    width: "20%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  textInput: { width: "80%", height: 50, borderRadius: 15 },
  searchContainer: {
    width: "100%",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
    justifyContent: "center",
  },
});

export default VehicleStatus;
