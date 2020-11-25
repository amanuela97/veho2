import { useTheme } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import { handleTextInput } from "react-native-formik";

function EditProfileScreen(props) {
  const { colors } = useTheme();
  const handleTextChange = () => {};
  return (
    <Screen>
      <View style={styles.container}>
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
              onChangeText={(item) => handleTextInput(item)}
            />
          </View>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
  },
  innerContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    width: "80%",
  },
  textInputCard: { elevation: 4 },
  textInputInner: { flexDirection: "row", width: "100%" },
});

export default EditProfileScreen;
