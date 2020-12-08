import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  ListItem as ListItemz,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button,
} from "native-base";
import { ListItem, ListItemSeparator } from "../components/lists";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import Icon from "../components/Icon";
//import routes from "../navigation/routes";
import Screen from "../components/Screen";
import { Header } from "@react-navigation/stack";
import { useTheme } from "@react-navigation/native";
import { AppAuthContext } from "../context/AppAuthContext";
import { db_auth, db_store } from "../Api/Db";

let newWidth = 100;
let newHeight = 100;
let quality = 1;
let rotation = 0;

function ProfileScreen({ navigation }) {
  const { user } = useContext(AppAuthContext);
  const { colors } = useTheme();
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(true);

  /*  const getData = async () => {

    const docu = await db_store.collection("veho").doc();
    const docuQ = await db_store
      .collection("veho")
      .doc(docu.id)
      .set({
        type:'charger',
        id:docu.id,
        name:'charger seveen',
        comment:{userId:[{'comment':'am waiting','time':'12:30','userName':'beselam'}]},
        queue: [
          
        ],
        })
   
  }; 
  useEffect(() => {
     const unsubscribe = db_store.collection("veho").onSnapshot((snapshot) => {
       displayChargers();
     });
     return () => unsubscribe(); 
    
   }, []);*/

  //ask for camera/roll permission
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestCameraRollPermissionsAsync();
        const { status2 } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted" && status2 !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
      if (image == null) {
        //fetch image inside here
      }
      setUploading(false);
    })();
  }, []);

  //select the image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    handleImagePicked(result);
  };
  // take photo from camera
  const takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    handleImagePicked(pickerResult);
  };

  // resize image and store in firebase storage
  const handleImagePicked = async (result) => {
    try {
      if (!result.cancelled) {
        const manipResult = await ImageManipulator.manipulateAsync(
          result.uri,
          [
            { rotate: rotation },
            { resize: { width: newWidth, height: newHeight } },
          ],
          { compress: quality, format: ImageManipulator.SaveFormat.PNG }
        );
        //to resolve file path issue on different platforms
        let uploadUri =
          Platform.OS === "ios"
            ? manipResult.uri.replace("file://", "")
            : manipResult.uri;
        setUploading(true);
        //upload  image to firebase storage under this comment

        setImage(uploadUri);
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Screen style={styles.screen}>
      <ListItemz
        thumbnail
        style={{ backgroundColor: colors.header, marginLeft: 5, marginTop: 10 }}
      >
        <Left>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Avatar",
                "set your avatar",
                [
                  {
                    text: "Take a photo",
                    onPress: () => {
                      takePhoto();
                    },
                  },
                  {
                    text: "Select from gallery",
                    onPress: () => {
                      pickImage();
                    },
                  },
                ],
                { cancelable: true }
              );
            }}
          >
            {image && !uploading && (
              <Thumbnail circle source={{ uri: image }} />
            )}
            {!uploading && image == null && (
              <Thumbnail circle source={require("../assets/profileP.jpg")} />
            )}
            {uploading && (
              <View>
                <ActivityIndicator
                  color="black"
                  style={{ marginTop: "35%" }}
                  stylleanimating
                  size="large"
                />
              </View>
            )}
          </TouchableOpacity>
        </Left>
        <Body>
          <Text>Insert text here.....</Text>
          <Text note numberOfLines={1}>
            {user.email}
          </Text>
        </Body>
      </ListItemz>
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
          onPress={() => {
            //var user = db_auth.currentUser;
            Alert.alert(
              "Delete Account",
              "Are you sure you want to delete this account?",
              [
                {
                  text: "No",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "YES",
                  onPress: () => {
                    /*var user = db_auth.currentUser;
                  user.delete().then(function() {
                  // User deleted.
                  console.log('account deleted');
                  }).catch(function(error) {
                  // An error happened.
                    console.log(error);
                  });*/
                  },
                },
              ],
              { cancelable: false }
            );
          }}
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