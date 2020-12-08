import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";

import { SimpleLineIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Avatar } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "@react-navigation/native";
import ChargerDetailScreen from "../screens/ChargerDetailScreen";
import CommentScreen from "../screens/CommentScreen";
import CreateQueueScreen from "../screens/CreateQueueScreen";
import QueueScreen from "../screens/QueueScreen";
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
        }}
      />
      <Stack.Screen name="Charger" component={ChargerDetailScreen} />
      <Stack.Screen name="Comment" component={CommentScreen} />
      <Stack.Screen name="ChargerQueue" component={CreateQueueScreen} />
      <Stack.Screen name="AllQueueScreen" component={QueueScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
