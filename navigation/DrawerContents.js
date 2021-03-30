import React, { useContext, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import {
  Avatar,
  Title,
  Caption,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { AppContext } from "../context/AppThemeContext";
import { DarkTheme, useTheme } from "@react-navigation/native";
import { AuthContextMain } from "../context/AppAuthContextMain";
import i18n from "i18n-js";

export function DrawerContent(props) {
  const { isDarkTheme, toggleTheme } = useContext(AppContext);
  const { logout, userAuth } = useContext(AuthContextMain);
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.drawer }}>
      <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false}>
        <View style={styles.drawerContent}>
          <Drawer.Section>
            <View style={styles.userInfoSection}>
              <View style={{ flexDirection: "row", marginTop: 15 }}>
                <View style={{}}>
                  <Image
                    style={{
                      resizeMode: "contain",
                      height: 50,
                      width: 60,
                      alignSelf: "center",
                    }}
                    source={
                      colors.light
                        ? require("../assets/logo_drawer_black.png")
                        : require("../assets/logo_drawer_white.png")
                    }
                  />
                </View>

                <View style={{ marginLeft: 15, flexDirection: "column" }}>
                  <Title style={styles.title}>{userAuth.userName}</Title>
                  <Caption style={styles.caption}>{userAuth?.company}</Caption>
                </View>
              </View>
            </View>
          </Drawer.Section>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons
                  name="car-electric"
                  size={24}
                  color={colors.text}
                />
              )}
              label={i18n.t("addVehicle")}
              onPress={() => {
                props.navigation.navigate("Vehicle");
              }}
            />
          </Drawer.Section>
          <Drawer.Section title={i18n.t("preferences")}>
            <TouchableRipple
              onPress={() => {
                toggleTheme();
              }}
            >
              <View style={styles.preference}>
                <Text>{i18n.t("darkTheme")}</Text>
                <View pointerEvents="none">
                  <Switch value={isDarkTheme} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <SimpleLineIcons name="logout" size={24} color={colors.text} />
          )}
          label={i18n.t("signOut")}
          onPress={() => {
            logout();
          }}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    paddingBottom: "10%",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
