import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import BookingDetailScreen from "../screens/BookingDetailScreen";
import { SimpleLineIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Avatar } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "@react-navigation/native";
const Stack = createStackNavigator();

//

const HomeStack = ({ navigation }) => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: colors.text,
        headerLeftContainerStyle: { width: "25%" },
        headerRightContainerStyle: { width: "25%" },
        headerStyle: {
          backgroundColor: colors.header,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerLeft: () => (
            <View
              style={{
                width: "100%",
                paddingLeft: "20%",
              }}
            >
              <SimpleLineIcons
                name="grid"
                size={20}
                color={colors.primary}
                onPress={() => navigation.openDrawer()}
              />
            </View>
          ),

          headerRight: () => (
            <View
              style={{
                width: "100%",
                paddingRight: "20%",
              }}
            >
              <Avatar.Image
                style={{
                  borderColor: "black",
                  alignSelf: "flex-end",
                  borderWidth: 0,
                }}
                size={30}
                source={require("../assets/profileP.jpg")}
              />
            </View>
          ),
        }}
      />
      <Stack.Screen name="Booking" component={BookingDetailScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
