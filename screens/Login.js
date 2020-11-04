import React from 'react';
import {TouchableOpacity} from 'react-native';
import { Container, Content, Form, Item,Button, Text} from 'native-base';
import FormTextInput from '../components/FormTextInput';
import LoginAndRegisterHook from '../hooks/LoginAndRegisterHook';

const Login = (props) =>{

  const {
      handlePasswordChange,
      handleEmailChange,
      inputs,
      errors,
  } = LoginAndRegisterHook();

  const handleLogin = () => {

    Firebase.auth()
        .signInWithEmailAndPassword(inputs.email, inputs.password)
        .then(() => this.props.navigation.navigate('App'))
        .catch(error => console.log(error))
  };

    return(
      <Container>
          <Content style={{marginTop: '10%'}}>
              <Form>
                  <Item>
                    <FormTextInput
                        autoCapitalize='none'
                        value={inputs.email}
                        placeholder='Email'
                        onChangeText={handleEmailChange}
                    />
                  </Item>
                  <Item>
                  <FormTextInput
                        autoCapitalize='none'
                        value={inputs.password}
                        placeholder='Password'
                        secureTextEntry={true}
                        onChangeText={handlePasswordChange}
                    />
                  </Item>
                  <Button success 
                  onPress={handleLogin}
                  style={{alignSelf: 'center', marginTop: '5%'}}  >
                        <Text>Sign in!</Text>
                  </Button>
                  <Button transparent style={{alignSelf: 'center',  marginTop: '5%'}}>
                    <TouchableOpacity>
                      <Text style={{fontSize: 15}}>Forgot Password?</Text>
                    </TouchableOpacity>
                  </Button>
              </Form>
              {errors.fetch &&
                <ErrorAlert alert={errors.fetch}/>
              }
          </Content>
      </Container>  
    );
};

export default Login;