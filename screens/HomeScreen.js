import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  Platform,
} from "react-native";
import AppText from "../components/AppText";
import { useTheme } from "@react-navigation/native";
import { db_auth, db_store } from "../Api/Db";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getChargers, getQueueList, getUserData } from "../Api/DbRequests";
import useApi from "../hooks/useApi";
import ActivityIndicator from "../components/ActivityIndicator";
import { Card } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import HomeChargerList from "../components/HomeChargerList";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthContextMain } from "../context/AppAuthContextMain";
import i18n from "i18n-js";

function HomeScreen({ navigation }) {
  const [chargers, setChargers] = useState([]);

  const [totalQueue, setTotalQueue] = useState([]);
  const [chargerSearch, setChargerSearch] = useState([]);
  const { userAuth, setUserAuth } = useContext(AuthContextMain);

  const chargerListApi = useApi(getChargers);
  const queueListApi = useApi(getQueueList);
  const getUserDataApi = useApi(getUserData);

  const displayChargers = async () => {
    const chargers = await chargerListApi.request();
    await setChargers(chargers.data);
    setChargerSearch(chargers.data);
  };

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
  };

  const setUserData = async () => {
    if (userAuth.company == undefined) {
      const userD = await getUserDataApi.request();

      if (!userD.error && userD.data) {
        if (userD.data.type == "admin") {
          return db_auth.signOut();
        }
        await setUserAuth(userD.data);
        await displayChargers();
        await handleGetQueueList();
      } else return;
    } else {
      const userD = await getUserDataApi.request();

      if (!userD.error && userD.data) {
        if (userD.data.type == "admin") {
          return db_auth.signOut();
        }
        await setUserAuth(userD.data);
        await displayChargers();
        await handleGetQueueList();
      } else {
        return;
      }
    }
  };

  const getUser = async () => {
    const userD = await getUserDataApi.request();
    if (!userD.error && userD.data) {
      if (userD.data.type == "admin") {
        return db_auth.signOut();
      }
      await setUserAuth(userD.data);
      await displayChargers();
      await handleGetQueueList();
    } else if (!userD.error && userD.data == undefined) {
      try {
        await db_auth.currentUser.delete();
        return;
      } catch (e) {}
    }

    return;
  };

  useEffect(() => {
    setUserData();
    const unsubscribe = db_store.collection("veho").onSnapshot((snapshot) => {
      let newList = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(data.company, userAuth.company);
        if (data.company == userAuth.company) {
          newList.push(doc.data());
          setChargers(newList);
        }
      });
    });
    const unsubscribeQueue = db_store.collection("queue").onSnapshot(
      (snapshot) => {
        let newList = [];

        snapshot.forEach((doc) => {
          if (doc.id == userAuth.company) {
            newList = doc.data().queue;
            setTotalQueue(newList);
          }
          return;
        });
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsubscribe();
      unsubscribeQueue();
    };
  }, []);

  const { colors } = useTheme();

  if (getUserDataApi.loading) {
    return <ActivityIndicator visible={chargerListApi.loading} />;
  }

  return (
    <View style={styles.container}>
      {colors.light ? <StatusBar style="light" /> : <StatusBar style="light" />}

      <View style={styles.queueContainer}>
        <Card
          style={{
            width: "94%",
            height: "80%",
            borderRadius: 10,
            backgroundColor: "black",
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
            <View>
              <Image source={require("../assets/queue2.png")} style={{}} />
            </View>
            <AppText
              style={{
                fontFamily: "OpenSans_700Bold",
                fontSize: 18,
                color: "white",
              }}
            >
              {i18n.t("currentQueueStatus")}
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
              <AppText style={{ color: colors.textLight }}>
                {i18n.t("noQueue")}
              </AppText>
            )}
          </View>
        </Card>
      </View>

      <View style={styles.chargerContainer}>
        <View style={styles.chargerSectionHeader}>
          <View style={{ width: "100%" }}>
            <View style={{ alignSelf: "flex-start", width: "100%" }}>
              <AppText style={[styles.sectionTitle, { color: "white" }]}>
                {i18n.t("chargers")}
              </AppText>
            </View>
            <Card style={styles.textInputCard}>
              <View style={styles.textInputInner}>
                <View style={styles.iconContainer}>
                  <FontAwesome5
                    name="searchengin"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <TextInput
                  style={[styles.textInput, { color: colors.text }]}
                  placeholder={i18n.t("searchACharger")}
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
        {userAuth.company ? (
          <FlatList
            data={chargers}
            showsVerticalScrollIndicator={false}
            keyExtractor={(list) => list.id}
            renderItem={({ item }) => <HomeChargerList item={item} />}
          />
        ) : (
          <TouchableOpacity
            style={{
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => getUser()}
          >
            <MaterialCommunityIcons name="refresh" size={40} color="white" />
            <AppText style={{ color: "white" }}>
              Please press to refresh your page
            </AppText>
          </TouchableOpacity>
        )}
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
    width: "100%",
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
    backgroundColor: "black",
    paddingHorizontal: 10,
    borderRadius: Platform.OS === "ios" ? 10 : 0,
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
