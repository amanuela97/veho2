import React from "react";
import { Container, Content, Header, Title, Tabs, Tab } from "native-base";
import Login from "./Login";
import SignUp from "./Signup";

const LoginAndSignUp = (props) => {
  return (
    <Container>
      <Header hasTabs style={{ marginTop: "20%" }}>
        <Title>Welcome</Title>
      </Header>
      <Content>
        <Tabs>
          <Tab heading="Login">
            <Login />
          </Tab>
          <Tab heading="Signup">
            <SignUp />
          </Tab>
        </Tabs>
      </Content>
    </Container>
  );
};

export default LoginAndSignUp;
