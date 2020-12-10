import React from "react";
import { View, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import AppText from "../components/AppText";

function CommentScreen({ navigation, route }) {
  const { comment, queueOwner } = route.params;
  // console.log(comment);
  console.log(queueOwner.comment);
  return (
    <View style={styles.container}>
      <View style={{ width: "100%" }}>
        <Card
          style={{
            width: "70%",

            padding: 10,
            marginLeft: 10,
          }}
        >
          <AppText>
            wwwsssssssssSASASASSAsasasaSASDSADSDASDSDS sd sadsd s d ds ds ds dd
            sad sadsadsadsad
          </AppText>
        </Card>
      </View>
      <View style={{ width: "100%", marginVertical: 10 }}>
        <Card
          style={{
            width: "70%",
            alignSelf: "flex-end",
            padding: 10,
            marginRight: 10,
          }}
        >
          <AppText>
            wwwsssssssssSASASASSAsasasaSASDSADSDASDSDS sd sadsd s d ds ds ds dd
            sad sadsadsadsad
          </AppText>
        </Card>
      </View>
      <AppText></AppText>
      <AppText></AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
});

export default CommentScreen;
