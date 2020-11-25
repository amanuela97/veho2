import React, { useContext } from "react";
import { Container, Content, Text, Button } from "native-base";
import { AppAuthContext } from "../context/AppAuthContext";

const Home = (props) => {
  const { user } = useContext(AppAuthContext);
  console.log("lemaa");
  return (
    <Container>
      <Content style={{ marginTop: "50%" }}>
        <Text style={{ alignSelf: "center" }}>HOME</Text>
        <Button Text="Logout" />
      </Content>
    </Container>
  );
};

export default Home;
