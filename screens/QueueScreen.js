/* import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import AppText from "../components/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from "../components/Icon";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import QueueList from "../components/QueueList";
import { cancelQueue } from "../Api/DbRequests";
import useApi from "../hooks/useApi";
import ActivityIndicator from "../components/ActivityIndicator";
import UploadScreen from "./UploadScreen";

function QueueScreen({ navigation, route }) {
  const [userQueue, setUserQueue] = useState([]);
  const [uploadVisible, setUploadVisible] = useState(false);

  const { queue, user } = route.params;
  const { colors } = useTheme();
  const cancelQueueApi = useApi(cancelQueue);
  const handleUserQueue = async (queue) => {
    const userQ = [];
    await queue.forEach((item) => {
      if (item.currentUserId === user.userId) {
        const index = queue.indexOf(item);
        item.position = index;
        userQ.push(item);
      }
      setUserQueue(userQ);
    });
  };
  const cancelQueueFun = async (item) => {
    const queue = await cancelQueueApi.request(item);
    if (!queue.error) {
      setUploadVisible(true);
    }
  };
  useEffect(() => {
    handleUserQueue(queue);
  }, []);

  if (cancelQueueApi.loading) {
    return <ActivityIndicator visible={true} />;
  }
  return (
    <View style={styles.container}>
      <UploadScreen
        onDone={() => {
          setUploadVisible(false);
          navigation.goBack();
        }}
        visible={uploadVisible}
      />
      <View>
        <View>
          <AppText style={[styles.title, { color: colors.negative }]}>
            Hi {user.userName}
          </AppText>
          <AppText style={[styles.subtitle, { color: colors.negative }]}>
            Thank you for waiting
          </AppText>
        </View>

        <View style={styles.waiting}>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={50}
            color={colors.secondary}
          />
        </View>
        <AppText style={[styles.subtitleTwo, { color: colors.negative }]}>
          Here is your queue list
        </AppText>
        <View style={[styles.queueNum, { backgroundColor: colors.header }]}>
          <AppText style={[{ color: colors.negative }]}>
            Vehicle you have on the Queue
          </AppText>
          <AppText>{userQueue.length}</AppText>
        </View>
        {userQueue !== undefined && userQueue.length > 0 && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={userQueue}
            ItemSeparatorComponent={ListItemSeparator}
            keyExtractor={(queue) => queue.chargingVehicleId}
            renderItem={({ item }) => (
              <QueueList
                item={item}
                renderRightActions={() => (
                  <ListItemDeleteAction onPress={() => cancelQueueFun(item)} />
                )}
              />
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
    marginTop: 20,
  },
  title: {
    fontFamily: "OpenSans_700Bold",
    fontSize: 25,
    marginVertical: 10,
    alignSelf: "center",
  },
  subtitle: {
    fontSize: 22,
    marginVertical: 2,
    alignSelf: "center",
    justifyContent: "center",
  },
  subtitleTwo: {
    fontSize: 18,
    marginVertical: 2,
    alignSelf: "center",
    justifyContent: "center",
    fontFamily: "OpenSans_600SemiBold",
  },
  waiting: {
    alignItems: "center",
  },
  queueNum: {
    flexDirection: "row",
    height: 60,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginVertical: 20,
    borderRadius: 10,
  },
  content: {
    fontSize: "OpenSans_300Light",
    fontSize: 17,
    marginTop: hp("6%"),
    marginLeft: 10,
  },
});

export default QueueScreen;
 */
