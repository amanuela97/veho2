import React, { useContext, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { ListItem } from "../components/lists";
import Icon from "../components/Icon";
import Screen from "../components/Screen";
import { useTheme } from "@react-navigation/native";
import { db_auth } from "../Api/Db";
import { deleteAccount } from "../Api/AppAuth";
import useApi from "../hooks/useApi";
import i18n from "i18n-js";
import { AuthContextMain } from "../context/AppAuthContextMain";

function ProfileScreen({ navigation }) {
  const { userAuth, setUserAuth } = useContext(AuthContextMain);
  const deleteAccountApi = useApi(deleteAccount);
  const { colors } = useTheme();

  const handleDelete = async () => {
    const request = await deleteAccountApi.request(userAuth.userId);
    if (request.error) {
      const err = request.data;
      console.log(err);
      Alert.alert(
        "Delete Account",
        err,

        { cancelable: false }
      );
    }
  };

  return (
    <Screen style={styles.screen}>
      <ListItem
        title={userAuth?.userName}
        subTitle={userAuth?.email}
        company={userAuth?.company}
        chevron={false}
        backgroundColor={colors.header}
      />

      <View style={styles.mini}>
        <ListItem
          title={i18n.t("username")}
          subTitle={userAuth.userName}
          backgroundColor={colors.header}
          IconComponent={<Icon name="face-profile" backgroundColor="green" />}
          onPress={() =>
            navigation.navigate("EditProfile", {
              userName: "flex",
              phoneNumber: "none",
              password: "none",
            })
          }
        />
        {/*     <ListItem
          title={i18n.t("phoneNumber")}
          subTitle={userAuth.phoneNumber}
          backgroundColor={colors.header}
          IconComponent={<Icon name="phone-log" backgroundColor="orange" />}
          onPress={() =>
            navigation.navigate("EditProfile", {
              userName: "none",
              phoneNumber: "flex",
              password: "none",
            })
          }
        /> */}
      </View>
      <View style={styles.mini}>
        <ListItem
          title={i18n.t("password")}
          subTitle="*******"
          backgroundColor={colors.header}
          IconComponent={<Icon name="shield-lock" backgroundColor="tomato" />}
          onPress={() =>
            navigation.navigate("EditProfile", {
              userName: "none",
              phoneNumber: "none",
              password: "flex",
            })
          }
        />
      </View>
      <ListItem
        title={i18n.t("deleteAccount")}
        subTitle={userAuth.userName}
        backgroundColor={colors.header}
        chevron={false}
        IconComponent={<Icon name="delete-sweep" backgroundColor="red" />}
        onPress={() => {
          //var user = db_auth.currentUser;
          Alert.alert(
            i18n.t("deleteAccount"),
            i18n.t("areYouSureYouWantToDeleteAccount"),
            [
              {
                text: i18n.t("No"),
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: i18n.t("Yes"),
                onPress: () => {
                  handleDelete();
                },
              },
            ],
            { cancelable: false }
          );
        }}
      />

      <View style={styles.logout}>
        <ListItem
          title={i18n.t("signOut")}
          backgroundColor={colors.header}
          onPress={() => {
            try {
              db_auth.signOut();
            } catch (e) {
              console.log(e);
            }
          }}
          IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    marginBottom: 10,
  },
  mini: {
    marginVertical: 20,
  },
  logout: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 10,
  },
});

export default ProfileScreen;
