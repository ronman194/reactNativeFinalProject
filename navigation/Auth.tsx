import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator();
// Navigator, Screen, Group

function Auth() {
    return (
        <Stack.Navigator screenOptions={{}} initialRouteName={"Login"}>
            <Stack.Screen
                name={"Login"}
                component={LoginScreen}
            />
            <Stack.Screen
                name={"Signup"}
                component={SignupScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={"Home"}
                component={BottomTabNavigator}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default Auth;