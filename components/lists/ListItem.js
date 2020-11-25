import React from "react";
import { View, StyleSheet, Image, TouchableHighlight } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";

import AppText from "../AppText";
import { useTheme } from "@react-navigation/native";

function ListItem({
  title,
  subTitle,
  image,
  IconComponent,
  onPress,
  renderRightActions,
  chevron = true,
  backgroundColor = "#fff",
}) {
  const { colors } = useTheme();
  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableHighlight underlayColor={colors.light} onPress={onPress}>
        <View style={[styles.container, { backgroundColor: backgroundColor }]}>
          {IconComponent}
          {image && <Image style={styles.image} source={image} />}
          <View style={styles.detailsContainer}>
            <AppText
              style={(styles.title, { color: colors.text })}
              numberOfLines={1}
            >
              {title}
            </AppText>
            {subTitle && (
              <AppText style={(styles.subTitle, { color: colors.textLight })}>
                {subTitle}
              </AppText>
            )}
          </View>
          {chevron && (
            <MaterialCommunityIcons
              color={colors.medium}
              name="chevron-right"
              size={25}
            />
          )}
        </View>
      </TouchableHighlight>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  subTitle: {},
  title: {
    fontWeight: "500",
  },
});

export default ListItem;
