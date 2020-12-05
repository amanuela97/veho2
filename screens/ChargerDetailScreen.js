import React, { createContext, useContext, useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { db_store } from "../Api/Db";
import { createQueue } from "../Api/DbRequests";
import ActivityIndicator from "../components/ActivityIndicator";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import { ErrorMessage } from "../components/forms";
import { ListItem, ListItemSeparator } from "../components/lists";
import { AppAuthContext } from "../context/AppAuthContext";
import useApi from "../hooks/useApi";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AppPicker from "../components/Picker";
import PickerItem from "../components/PickerItem";
import colors from "../config/colors";
import { useTheme } from "@react-navigation/native";
import UploadScreen from "./UploadScreen";
import { Card } from "native-base";

function ChargerDetailScreen({ route, navigation }) {
  const [error, setError] = useState();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [initializing, setInitializer] = useState(true);
  const [pickedItem, setPickedItem] = useState("");
  const { charger } = route.params;
  const { user } = useContext(AppAuthContext);
  const createQueueApi = useApi(createQueue);
  const { colors } = useTheme();

  const handleQueue = async () => {
    const queue = await createQueueApi.request(
      user.userId,
      user.userName,
      charger.id
    );
    if (!queue.error) {
      setUploadVisible(true);
    }
  };

  const categories = [];
  const handlePickerSelection = (item) => {
    setPickedItem(item.itemName);
  };
  useEffect(() => {
    /*  updater();
    const subscribe = db_store
      .collection("veho")
      .doc(charger.id)
      .onSnapshot((snapshot) => {
        setChargerDetail(snapshot.data());
      });
    return () => subscribe(); */
  }, []);

  if (createQueueApi.loading) {
    return <ActivityIndicator visible={true} />;
  }
  if (charger.status === "busy")
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Card
          style={{
            paddingVertical: 40,
            paddingHorizontal: 10,
            backgroundColor: "orange",
            width: "90%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View>
            <AppText>This charger is currently busy</AppText>
          </View>
        </Card>
      </View>
    );
  return (
    <View style={styles.container}>
      <UploadScreen
        onDone={() => {
          setUploadVisible(false);
          navigation.goBack();
        }}
        visible={uploadVisible}
      />
      <View style={styles.upperContainer}>
        <ErrorMessage
          error={createQueueApi.data}
          visible={createQueueApi.error}
        />
        <View style={[styles.chargerName, { backgroundColor: colors.header }]}>
          <AppText style={{ color: colors.text }}>{charger.name}</AppText>
        </View>
        <View style={[styles.chargerName, { backgroundColor: colors.header }]}>
          <AppText style={{ color: colors.text }}>
            Queue : {charger.queue.length}
          </AppText>
        </View>

        <AppPicker
          icon="car-electric"
          items={categories}
          numberOfColumns={1}
          PickerItemComponent={PickerItem}
          onSelectItem={handlePickerSelection}
          placeholder={pickedItem.length < 1 ? " Select Car" : pickedItem}
          width="100%"
          backgroundColor={colors.header}
        />

        <AppButton
          title="check in to this queue"
          onPress={() => handleQueue()}
          color={colors.primary}
        />
        <View style={[styles.chargerName, { backgroundColor: colors.header }]}>
          <AppText
            style={{
              color: colors.text,
              fontFamily: "OpenSans_600SemiBold",
            }}
          >
            Users on the Queue
          </AppText>
        </View>
      </View>

      <View style={styles.lowerContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={charger.queue}
          ItemSeparatorComponent={ListItemSeparator}
          keyExtractor={(list) => list.userName}
          renderItem={({ item }) => (
            <ListItem
              title={item.userName === user.userName ? "You" : item.userName}
              image={require("../assets/profileP.jpg")}
              backgroundColor={colors.header}
              onPress={() =>
                navigation.navigate("Comment", {
                  comment: charger.comment,
                  queueOwner: item,
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
  },
  upperContainer: {
    flex: 2,
    marginTop: hp("4%"),
    width: "100%",
    paddingHorizontal: 14,
  },
  lowerContainer: { flex: 2, paddingHorizontal: 14 },
  chargerName: {
    marginBottom: 10,
    paddingVertical: hp("2%"),
    paddingLeft: 10,
    borderRadius: 10,
  },
});

export default ChargerDetailScreen;
/**
 * 
 *  const request = db_store
      .collection("veho")
      .doc(charger.id)
      .onSnapshot((snapshot) => {
        setChargerDetail(snapshot.data());
      });
    setInitializer(false);
    return request;
 */
