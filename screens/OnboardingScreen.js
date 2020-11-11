import React from "react";
import { View, StyleSheet } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import * as Animatable from "react-native-animatable";
import { useTheme } from "@react-navigation/native";
function OnboardingScreen({ navigation }) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Onboarding
        onSkip={() => navigation.replace("Login")}
        onDone={() => navigation.replace("Login")}
        containerStyles={{ width: "100%", height: "100%" }}
        transitionAnimationDuration={1000}
        pages={[
          {
            backgroundColor: colors.background,
            title: "Welcome",
            image: (
              <Animatable.Image
                animation="bounceIn"
                duration={2000}
                style={{
                  width: 200,
                  height: 200,

                  overflow: "visible",
                }}
                source={require("../assets/calander.png")}
              />
            ),
            subtitle: "Done with React Native Onboarding Swiper",
          },
          {
            backgroundColor: colors.background,
            title: "Welcome",
            image: (
              <Animatable.Image
                animation="swing"
                duration={2000}
                iterationCount="infinite"
                iterationDelay={5000}
                style={{
                  width: 200,
                  height: 200,

                  overflow: "visible",
                }}
                source={require("../assets/car_charging.png")}
              />
            ),
            subtitle: "Done with React Native Onboarding Swiper",
          },
          {
            backgroundColor: colors.background,
            title: "Welcome",
            image: (
              <Animatable.Image
                animation="swing"
                duration={2000}
                iterationCount="infinite"
                iterationDelay={5000}
                style={{
                  width: 200,
                  height: 200,

                  overflow: "visible",
                }}
                source={require("../assets/chat.png")}
              />
            ),
            subtitle: "Done with React Native Onboarding Swiper",
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default OnboardingScreen;
