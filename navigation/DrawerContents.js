import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
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
import { useTheme } from "@react-navigation/native";
import { AuthContextMain } from "../context/AppAuthContextMain";

export function DrawerContent(props) {
  const { isDarkTheme, toggleTheme } = useContext(AppContext);
  const { logout } = useContext(AuthContextMain);
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.drawer }}>
      <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false}>
        <View style={styles.drawerContent}>
          <Drawer.Section>
            <View style={styles.userInfoSection}>
              <View style={{ flexDirection: "row", marginTop: 15 }}>
                <Avatar.Image
                  source={require("../assets/profileP.jpg")}
                  size={50}
                />
                <View style={{ marginLeft: 15, flexDirection: "column" }}>
                  <Title style={styles.title}>John Doe</Title>
                  <Caption style={styles.caption}>@j_doe</Caption>
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
              label="Add Vehicle"
              onPress={() => {
                props.navigation.navigate("Vehicle");
              }}
            />

            <DrawerItem
              icon={({ color, size }) => (
                <Octicons name="settings" size={24} color={colors.text} />
              )}
              label="Settings"
              onPress={() => {
                props.navigation.navigate("Setting");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <FontAwesome5
                  name="paper-plane"
                  size={24}
                  color={colors.text}
                />
              )}
              label="Feedback"
              onPress={() => {
                props.navigation.navigate("Feedback");
              }}
            />
          </Drawer.Section>
          <Drawer.Section title="Preferences">
            <TouchableRipple
              onPress={() => {
                toggleTheme();
              }}
            >
              <View style={styles.preference}>
                <Text>Dark Theme</Text>
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
          label="Sign Out"
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
