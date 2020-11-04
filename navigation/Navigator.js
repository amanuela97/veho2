import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginAndSignup from '../screens/LoginAndSignup';
import Home from '../screens/Home';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name='Home' component={ Home } />
        </Tab.Navigator>
    );
}

const Navigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name='Auth' component={ LoginAndSignup } />
                <Stack.Screen name='App' component={ TabNavigator } />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigator;