import React, { useContext } from "react";
import { StyleSheet, View, FlatList } from "react-native";

import { ListItem, ListItemSeparator } from "../components/lists";
import Icon from "../components/Icon";
//import routes from "../navigation/routes";
import Screen from "../components/Screen";
import { Header } from "@react-navigation/stack";
import { useTheme } from "@react-navigation/native";
import { AppAuthContext } from "../context/AppAuthContext";
import { db_auth } from "../Api/Db";

function ProfileScreen({ navigation }) {
  const { user } = useContext(AppAuthContext);
  const { colors } = useTheme();

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title="Beselam Veho"
          subTitle="beselam@gmail.com"
          image={require("../assets/profileP.jpg")}
          chevron={false}
          backgroundColor={colors.header}
        />
      </View>
      <View style={styles.mini}>
        <ListItem
          title="username"
          subTitle={user.userName}
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
        <ListItem
          title="phone number"
          subTitle={user.phoneNumber}
          backgroundColor={colors.header}
          IconComponent={<Icon name="phone-log" backgroundColor="orange" />}
          onPress={() =>
            navigation.navigate("EditProfile", {
              userName: "none",
              phoneNumber: "flex",
              password: "none",
            })
          }
        />
      </View>
      <View style={styles.mini}>
        <ListItem
          title="password"
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
        <ListItem
          title="delete account"
          subTitle={user.userName}
          backgroundColor={colors.header}
          chevron={false}
          IconComponent={<Icon name="delete-sweep" backgroundColor="red" />}
        />
      </View>
      <View style={styles.logout}>
        <ListItem
          title="Sign Out"
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
