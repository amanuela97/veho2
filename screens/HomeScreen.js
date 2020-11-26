import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TextInput, Image } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { db_auth, db_store } from "../Api/Db";
import { AppAuthContext } from "../context/AppAuthContext";
import { set } from "react-native-reanimated";
import { getChargers } from "../Api/DbRequests";
import useApi from "../hooks/useApi";
import ActivityIndicator from "../components/ActivityIndicator";
import { Card } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import HomeChargerList from "../components/HomeChargerList";
import HomeQueueListCard from "../components/HomeQueueListCard";
import QueueModal from "../components/QueueModal";
import ForgetPasswordDialog from "../components/ForgetPasswordDialog";
function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState();
  const [chargers, setChargers] = useState([]);
  const [queueModalContent, setQueueModalContent] = useState({});
  const [queueVisible, setQueueVisible] = useState(false);
  const [userQueue, setUserQueue] = useState([]);
  const [chargerSearch, setChargerSearch] = useState([]);
  const { user } = useContext(AppAuthContext);
  const chargerListApi = useApi(getChargers);

  const displayChargers = async () => {
    const chargers = await chargerListApi.request();
    await setChargers(chargers.data);
    queue(chargers.data);
    setChargerSearch(chargers.data);
  };

  const queue = async (chargers) => {
    setQueueVisible(false);
    const queueList = [];
    await chargers.forEach((charger) => {
      const id = charger.id;
      const chargerName = charger.name;
      const queue = charger.queue;
      queue.forEach((q) => {
        if (q.userId === user.userId) {
          const index = queue.indexOf(q) + 1;
          const userQueue = {
            chargerName: chargerName,
            queue: index,
            chargerId: id,
            queueObject: q,
          };
          queueList.push(userQueue);
        }
      });
    });
    console.log("finalll");
    await setUserQueue(queueList);
    setQueueVisible(true);
  };
  const handleSearch = (text) => {
    const userInput = text.toLowerCase();
    const newList = chargerSearch.filter((charger) =>
      charger.name.toLowerCase().includes(userInput)
    );
    setChargers(newList);
  };

  useEffect(() => {
    const unsubscribe = db_store.collection("veho").onSnapshot((snapshot) => {
      displayChargers();
    });
    return () => unsubscribe();
  }, []);

  const { colors } = useTheme();

  if (chargerListApi.loading) {
    return <ActivityIndicator visible={chargerListApi.loading} />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.queueContainer}>
        <View style={styles.innerContainer}>
          {userQueue.length < 1 ? (
            <View
              style={[
                styles.noQueueContainer,
                { backgroundColor: colors.header },
              ]}
            >
              <AppText style={{ color: colors.text }}>
                No queue available
              </AppText>
            </View>
          ) : (
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={userQueue}
              keyExtractor={(list) =>
                list.chargerId + list.chargerName + list.queue
              }
              renderItem={({ item }) => (
                <HomeQueueListCard
                  onPress={() => {
                    setQueueModalContent(item);
                    setModalVisible(true);
                  }}
                  cardVisible={queueVisible}
                  currentQueue={item}
                />
              )}
            />
          )}
        </View>
        {modalVisible && (
          <QueueModal
            isModalVisible={modalVisible}
            setVisible={setModalVisible}
            item={queueModalContent}
          />
        )}
      </View>

      <View style={styles.chargerContainer}>
        <View style={styles.chargerSectionHeader}>
          <View style={{ width: "100%" }}>
            <View>
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
              onPress={() =>
                navigation.navigate("Charger", {
                  charger: item,
                })
              }
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
  chargerContainer: {
    flex: 3,
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
  textInputCard: { elevation: 4 },

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
