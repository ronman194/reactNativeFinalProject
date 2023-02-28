import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import BottomTabNavigator from './BottomTabNavigator';
import Colors from '../tools/Colors';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator();
// Navigator, Screen, Group

function Auth() {
    const isLoggedIn = useSelector((state: any) => state.isLoggedIn);
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: 'center', headerTitleStyle: {
                    color: 'white'
                },
                headerStyle: { backgroundColor: Colors.header }
            }}>
            {!isLoggedIn ?
                <Stack.Group >
                    <Stack.Screen
                        name={"Login"}
                        component={LoginScreen}
                    />
                    <Stack.Screen
                        name={"Signup"}
                        component={SignupScreen}
                    />
                </Stack.Group> :
                <Stack.Group >

                    <Stack.Screen
                        name={"Home"}
                        component={BottomTabNavigator}
                        options={{ headerShown: false }}
                    />
                </Stack.Group>}
        </Stack.Navigator>
    );
}

export default Auth;