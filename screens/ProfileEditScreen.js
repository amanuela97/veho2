import { useTheme } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Card } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import Screen from "../components/Screen";
import AppButton from "../components/AppButton";
import { AppAuthContext } from "../context/AppAuthContext";
import useApi from "../hooks/useApi";
import {
  updateUsername,
  updatePhoneNumber,
  updatePassword,
} from "../Api/DbRequests";
import { ErrorMessage } from "../components/forms";
import UploadScreen from "./UploadScreen";
import ActivityIndicator from "../components/ActivityIndicator";

function ProfileEditScreen({ route, navigation }) {
  const [userInfo, setUserInfo] = useState("");
  const [error, setError] = useState("");
  const [uploadVisible, setUploadVisible] = useState(false);
  const { userName, phoneNumber, password } = route.params;

  const { user, setUser } = useContext(AppAuthContext);

  const updateUsernameApi = useApi(updateUsername);
  const updatePhoneNumberApi = useApi(updatePhoneNumber);
  const updatePasswordApi = useApi(updatePassword);
  const { colors } = useTheme();

  const handleUserNameChange = async () => {
    const result = await updateUsernameApi.request(userInfo, user.userId);
    if (!result.error) {
      setUser(result.data);
      setUploadVisible(true);
    } else {
      setError(result.data);
    }
  };

  const handlePhoneNumberChange = async () => {
    const result = await updatePhoneNumberApi.request(userInfo, user.userId);
    if (!result.error) {
      setUser(result.data);
      setUploadVisible(true);
    } else {
      setError(result.data);
    }
  };

  const handlePasswordChange = async () => {
    const result = await updatePasswordApi.request(userInfo);
    if (!result.error) {
      // setUser(result.data);
      setUploadVisible(true);
    } else {
      setError(result.data);
    }
  };

  if (updateUsernameApi.loading || updatePhoneNumberApi.loading) {
    return <ActivityIndicator visible={true} />;
  }
  return (
    <Screen>
      <View style={styles.container}>
        <UploadScreen
          onDone={() => {
            setUploadVisible(false);
            navigation.goBack();
          }}
          visible={uploadVisible}
        />
        <ErrorMessage
          visible={
            updatePhoneNumberApi.error ||
            updateUsernameApi.error ||
            updatePasswordApi.error
          }
          error={error}
          style={styles.error}
        />

        <Card style={[styles.textInputCard, { display: userName }]}>
          <TextInput
            style={[styles.textInput, { color: colors.text }]}
            placeholder={user.userName}
            clearButtonMode="while-editing"
            placeholderTextColor={colors.textLight}
            autoCorrect={false}
            autoCapitalize="none"
            maxLength={20}
            onChangeText={(item) => setUserInfo(item)}
          />
        </Card>

        <Card style={[styles.textInputCard, { display: phoneNumber }]}>
          <TextInput
            style={[styles.textInput, { color: colors.text }]}
            placeholder={user.phoneNumber}
            clearButtonMode="while-editing"
            maxLength={30}
            textContentType="telephoneNumber"
            keyboardType="numeric"
            placeholderTextColor={colors.textLight}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(item) => setUserInfo(item)}
          />
        </Card>

        <Card style={[styles.textInputCard, { display: password }]}>
          <TextInput
            style={[styles.textInput, { color: colors.text }]}
            placeholder="change password"
            clearButtonMode="while-editing"
            maxLength={30}
            textContentType="newPassword"
            keyboardType="default"
            secureTextEntry={true}
            placeholderTextColor={colors.textLight}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(item) => setUserInfo(item)}
          />
        </Card>
        <AppButton
          title="submit"
          color={colors.primary}
          onPress={() => {
            if (userName !== "none") {
              handleUserNameChange();
            } else if (phoneNumber !== "none") {
              handlePhoneNumberChange();
            } else {
              handlePasswordChange();
            }
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: "10%",
    marginHorizontal: 12,
  },
  innerContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    width: "100%",
    height: 50,
    padding: 10,
  },
  textInputCard: {
    elevation: 2,
    width: "100%",
    marginBottom: 20,
  },
  textInputInner: { flexDirection: "row", width: "100%" },
  error: { marginVertical: 20 },
});

export default ProfileEditScreen;
