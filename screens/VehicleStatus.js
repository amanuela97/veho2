import { useTheme } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Appbar } from "react-native-paper";
import LottieView from "lottie-react-native";
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
import { db_store, func } from "../Api/Db";
import ListItemCar from "../components/lists/ListItemCar";
import ListItemAddQueueAction from "../components/lists/ListItemAddQueueAction ";
import CarAnim from "./CarAnim";
import useNotifications from "../hooks/useNotifications";
import AppButton from "../components/AppButton";
import { result } from "validate.js";

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
  useNotifications();
  const handleGetVehicles = async () => {
    console.log("caledd");
    const vehiclesList = await getVehicleApi.request();
    await setVehicles(vehiclesList.data);
    setSearchVehicles(vehiclesList.data);

    handleGetVehiclesData(vehiclesList.data);
  };

  const handleGetVehiclesData = async (vehiclesList) => {
    const list = [];
    await vehiclesList.forEach((vehicle) => {
      if (vehicle.connected) {
        (async () => {
          const token = await fetchToken();
          const carDetail = await fetchCarDetails(token, vehicle.vin);
          if (carDetail === undefined) {
            return list.push(vehicle);
          } else if (carDetail) {
            (async () => {
              (vehicle.batteryState = carDetail.batteryState),
                (vehicle.chargingStatus = carDetail.chargingStatus),
                (vehicle.endOfChargeTime = carDetail.endofchargetime),
                (vehicle.chargingActive = carDetail.chargingActive),
                (vehicle.soc = carDetail.soc),
                (vehicle.otherInfo = carDetail);
              await updateVehicle(vehicle.vehicleId, vehicle);
              return list.push(vehicle);
            })();
          }
        })();
      }
      return list.push(vehicle);
    });
  };

  const handleDeleteVehicles = async (item) => {
    const vehiclesList = await deleteVehicleApi.request(item);
    if (!vehiclesList.error) {
      setVehicles(vehiclesList.data);
      setSearchVehicles(vehiclesList.data);
      setUploadVisible(true);
    }
  };

  const updatePosition = async (newList) => {
    console.log("length", vehicles.length);
    if (vehicles.length !== 0 && vehicles !== undefined) {
      console.log("here");
      vehicles.forEach((vehicle) => {
        if (newList.includes(vehicle.vehicleId)) {
          const position = newList.indexOf(vehicle.vehicleId) + 1;
          updateVehicleSingleInfo(
            vehicle.vehicleId,
            true,
            false,
            false,
            "null",
            "null",
            position
          );
        }
      });
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

  useEffect(() => {
    const unsubscribeVehicle = db_store
      .collection("vehicle")
      .where("ownerId", "==", user.userId)
      .onSnapshot((snapshot) => {
        const newList = [];
        snapshot.forEach((doc) => {
          newList.push(doc.data());
        });
        setVehicles(newList);
      });

    handleGetVehicles();
    const unsubscribeQueue = db_store
      .collection("queue")
      .onSnapshot((snapshot) => {
        let newList = [];
        snapshot.forEach((doc) => {
          newList = doc.data().queue;
          console.log("dddddd", newList);
        });

        updatePosition(newList);
      });

    return () => {
      unsubscribeQueue();
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
    cancelQueueApi.loading
  ) {
    return <ActivityIndicator visible={true} />;
  }
  return (
    <View style={styles.container}>
      <Appbar.Header
        style={{
          width: "100%",
          backgroundColor: colors.header,
          elevation: 0,
          height: 40,
        }}
      >
        <Appbar.Content title="vehicles" />
      </Appbar.Header>
      <ListItemSeparator />
      <View style={styles.mainContainer}>
        <View style={styles.searchContainer}>
          <View>
            <AppText style={[styles.sectionTitle, { color: colors.text }]}>
              vehicle collection
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
                placeholder="search a vehicle"
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
                  backgroundColor: "white",
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
                  onPress={() => console.log("kk")}
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
    backgroundColor: "#F5F5F5",
  },
  sectionTitle: {
    fontFamily: "OpenSans_600SemiBold",
    fontSize: 20,
    marginVertical: 20,
    paddingLeft: 5,
  },
  textInputCard: { elevation: 4 },

  textInputInner: { flexDirection: "row", width: "100%" },
  iconContainer: {
    width: "20%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  textInput: { width: "80%", height: 50 },
  searchContainer: {
    width: "100%",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
    justifyContent: "center",
  },
});

export default VehicleStatus;
