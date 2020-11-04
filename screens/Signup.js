import React from 'react';
import { Container, Content, Form, Item, Title, H2 , Button, Text} from 'native-base';
import FormTextInput from '../components/FormTextInput';
import LoginAndRegisterHook from '../hooks/LoginAndRegisterHook';
import Firebase from '../config/Firebase';
import ErrorAlert from '../components/ErrorAlert';

const SignUp = (props) =>{

    const {
        handleUsernameChange,
        handlePasswordChange,
        handleConfirmPasswordChange,
        handleEmailChange,
        handleCompanyIdChange,
        handlePhoneNumberChange,
        validateField,
        validateOnSignUp,
        inputs,
        errors,
    } = LoginAndRegisterHook();

    const validationProperties = {
        companyId: {companyId: inputs.companyId},
        username: {username: inputs.username},
        email: {email: inputs.email},
        phoneNumber: {full_name: inputs.phoneNumber},
        password: {password: inputs.password},
        confirmPassword: {
            password: inputs.password,
            confirmPassword: inputs.confirmPassword,
        },
    };

    const handleSignUp = async (props) => {

        const regValid = validateOnSignUp(validationProperties);
        console.log('reg field errors', errors);
        
        if (!regValid) {
            return;
        }else{

        try {
            console.log('inputs:', inputs);
            const user = inputs;
            delete user.confirmPassword;

            Firebase.auth()
            .createUserWithEmailAndPassword(user.email, user.password)
            .then(() => props.navigation.navigate('App'))
            .catch(error => console.log(error));
        } catch (e) {
            console.log('registerAsync error: ', e.message);
            setErrors((errors) =>
                ({
                    ...errors,
                    fetch: e.message,
                }));
        }
        }
    };

    return(
      <Container>
          <Content style={{marginTop: '10%'}}>
          <Form>
                    <Item>
                        <FormTextInput
                            autoCapitalize='none'
                            value={inputs.companyId}
                            placeholder='Company ID'
                            onChangeText={handleCompanyIdChange}
                            onEndEditing={() => {
                                validateField(validationProperties.companyId);
                            }}
                            error={errors.companyId}
                        />
                    </Item>
                    <Item>
                        <FormTextInput
                            autoCapitalize='none'
                            value={inputs.email}
                            placeholder='Email'
                            onChangeText={handleEmailChange}
                            onEndEditing={() => {
                                validateField(validationProperties.email);
                            }}
                            error={errors.email}
                        />
                    </Item>
                    <Item>
                        <FormTextInput
                            autoCapitalize='none'
                            value={inputs.username}
                            placeholder='Username'
                            onChangeText={handleUsernameChange}
                            onEndEditing={() => {
                                validateField(validationProperties.username);
                            }}
                            error={errors.username}
                        />
                    </Item>
                    <Item>
                        <FormTextInput
                            autoCapitalize='none'
                            value={inputs.password}
                            placeholder='password'
                            secureTextEntry={true}
                            onChangeText={handlePasswordChange}
                            onEndEditing={() => {
                                validateField(validationProperties.password);
                            }}
                            error={errors.password}
                        />
                    </Item>
                    <Item>
                        <FormTextInput
                            autoCapitalize='none'
                            value={inputs.confirmPassword}
                            placeholder='confirm password'
                            secureTextEntry={true}
                            onChangeText={handleConfirmPasswordChange}
                            onEndEditing={() => {
                                validateField(validationProperties.confirmPassword);
                            }}
                            error={errors.confirmPassword}
                        />
                    </Item>
                    <Item>
                        <FormTextInput
                            autoCapitalize='none'
                            value={inputs.full_name}
                            placeholder='Phone number'
                            onChangeText={handlePhoneNumberChange}
                            onEndEditing={() => {
                                validateField(validationProperties.phoneNumber);
                            }}
                            error={errors.phoneNumber}
                        />
                    </Item>
                    <Button success block 
                    onPress={handleSignUp}
                    style={{alignSelf: 'center', marginTop: '5%'}} 
                     >
                        <Text>Register!</Text>
                    </Button>
                </Form>
                {errors.fetch &&
                    <ErrorAlert alert={errors.fetch}/>
                }
          </Content>
      </Container>  
    );
};

export default SignUp;