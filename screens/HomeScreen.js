import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { db_auth, db_store } from "../Api/Db";
import { AppAuthContext } from "../context/AppAuthContext";
import { StatusBar } from "expo-status-bar";

import { set } from "react-native-reanimated";
import {
  chargerListener,
  getChargers,
  getQueueList,
  getUserData,
} from "../Api/DbRequests";
import useApi from "../hooks/useApi";
import ActivityIndicator from "../components/ActivityIndicator";
import { Card } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import HomeChargerList from "../components/HomeChargerList";
import HomeQueueListCard from "../components/HomeQueueListCard";
import QueueModal from "../components/QueueModal";
import ForgetPasswordDialog from "../components/ForgetPasswordDialog";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthContextMain } from "../context/AppAuthContextMain";
function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState();
  const [chargers, setChargers] = useState([]);
  const [chargingCars, setChargingCars] = useState([]);
  const [queueModalContent, setQueueModalContent] = useState({});
  const [queueVisible, setQueueVisible] = useState(false);
  const [userQueue, setUserQueue] = useState([]);
  const [totalQueue, setTotalQueue] = useState([]);
  const [chargerSearch, setChargerSearch] = useState([]);
  const { user, setUser } = useContext(AppAuthContext);
  const { userAuth, logout } = useContext(AuthContextMain);

  const chargerListApi = useApi(getChargers);
  const queueListApi = useApi(getQueueList);

  const displayChargers = async () => {
    const chargers = await chargerListApi.request();
    await setChargers(chargers.data);
    setChargerSearch(chargers.data);
    //  handleChargingCars(chargers.data);
  };

  /*  const handleChargingCars = async (chargers) => {
    const cars = await chargers.filter((item) => {
      const currentUsr = item.currentUser;
      return currentUsr.currentUserId === user.userId;
    });
    await setChargingCars(cars);
  }; */
  const handleSearch = (text) => {
    const userInput = text.toLowerCase();
    const newList = chargerSearch.filter((charger) =>
      charger.name.toLowerCase().includes(userInput)
    );
    setChargers(newList);
  };
  const handleGetQueueList = async () => {
    const list = await queueListApi.request();
    if (!list.error) {
      setTotalQueue(list.data);
    }
    console.log("jjjjjjjjjjjjj");
  };

  const setUserData = async () => {
    const userD = await getUserData();
    setUser(userD.data);
  };

  useEffect(() => {
    setUserData();
    handleGetQueueList();
    const unsubscribe = db_store.collection("veho").onSnapshot((snapshot) => {
      let newList = [];
      snapshot.forEach((doc) => {
        newList.push(doc.data());
      });
      //chargerListener(newList);
      displayChargers();
    });
    const unsubscribeQueue = db_store
      .collection("queue")
      .onSnapshot((snapshot) => {
        let newList = [];
        snapshot.forEach((doc) => {
          newList = doc.data().queue;
        });
        setTotalQueue(newList);
      });
    return () => {
      unsubscribe();
      unsubscribeQueue();
    };
  }, []);

  const { colors } = useTheme();

  if (chargerListApi.loading) {
    return <ActivityIndicator visible={chargerListApi.loading} />;
  }
  return (
    <View style={styles.container}>
      {colors.light ? <StatusBar style="dark" /> : <StatusBar style="light" />}

      <View style={styles.queueContainer}>
        <Card
          style={{
            width: "94%",
            height: "80%",
            backgroundColor: "#112222",
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AppText
              style={{
                fontFamily: "OpenSans_700Bold",
                fontSize: 18,
                color: "white",
              }}
            >
              current queue status
            </AppText>
            {totalQueue?.length > 0 ? (
              <AppText
                style={{
                  fontFamily: "OpenSans_700Bold",
                  fontSize: 30,
                  color: "#d6d6d6",
                }}
              >
                {totalQueue.length}
              </AppText>
            ) : (
              <AppText style={{ color: colors.textLight }}>no Queue</AppText>
            )}
          </View>
        </Card>
      </View>

      <View style={styles.chargerContainer}>
        <View style={styles.chargerSectionHeader}>
          <View style={{ width: "100%" }}>
            <View style={{ alignSelf: "flex-start", width: "100%" }}>
              <AppText style={[styles.sectionTitle, { color: colors.text }]}>
                chargers
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
                  placeholder="search a charger"
                  clearButtonMode="while-editing"
                  placeholderTextColor={colors.textLight}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={(item) => handleSearch(item)}
                />
              </View>
            </Card>
          </View>
        </View>
        <FlatList
          data={chargers}
          keyExtractor={(list) => list.id}
          renderItem={({ item }) => (
            <HomeChargerList
              item={item}
              onPress={() => {
                if (item.status === "free") {
                  navigation.navigate("Charger", {
                    charger: item,
                  });
                }
                if (item.status === "busy") {
                  Alert.alert(
                    "",
                    "this charger is currently busy, please select a free charger",
                    [
                      {
                        text: "ok ",
                        onPress: () => {},
                      },
                    ],
                    { cancelable: true }
                  );
                }
              }}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  queueContainer: {
    flex: 1,
    width: "100%",

    justifyContent: "center",
    alignItems: "center",
  },
  totalQueueContainer: {
    paddingVertical: 10,

    justifyContent: "center",
    alignItems: "center",
  },
  totalQueueTO: {
    backgroundColor: "#333333",
    width: wp("100%"),
    justifyContent: "center",
    alignItems: "center",
  },
  chargerContainer: {
    flex: 3.5,
    width: "94%",
  },
  chargerSectionHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 10,
  },
  noQueueContainer: {
    paddingVertical: 10,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontFamily: "OpenSans_600SemiBold",
    fontSize: 20,
    marginVertical: 20,
    paddingLeft: 5,
  },
  textInputCard: { elevation: 2, borderRadius: 10 },

  textInputInner: { flexDirection: "row", width: "100%" },
  ll: {
    width: "100%",
  },
  iconContainer: {
    width: "20%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  textInput: { width: "80%", height: 50 },
});

export default HomeScreen;
