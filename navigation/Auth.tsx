import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import BottomTabNavigator from './BottomTabNavigator';
import Colors from '../tools/Colors';

const Stack = createNativeStackNavigator();
// Navigator, Screen, Group

function Auth() {
    return (
        <Stack.Navigator 
            screenOptions={{
                headerTitleAlign: 'center', headerTitleStyle: {
                    color: Colors.text
                },
                headerStyle: { backgroundColor: Colors.header }
            }}
            initialRouteName={"Login"}>
            <Stack.Screen
                name={"Login"}
                component={LoginScreen}
            />
            <Stack.Screen
                name={"Signup"}
                component={SignupScreen}
            />
            <Stack.Screen
                name={"Home"}
                component={BottomTabNavigator}
                options={{ headerShown: false}}
            />
        </Stack.Navigator>
    );
}

export default Auth;