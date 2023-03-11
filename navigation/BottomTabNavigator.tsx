import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ProfileScreen from '../screens/ProfileScreen';
import PostStack from './PostStack';
import Colors from '../tools/Colors';
import Chat from '../screens/Chat';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
    const navigation = useNavigation();

    return (
        <Tab.Navigator initialRouteName="Posts" screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName: any = "";
                if (route.name === 'Profile') {
                    iconName = focused ? 'person-circle' : 'person-circle-outline';
                }
                else if (route.name === 'Posts') {
                    iconName = focused ? 'home' : 'home-outline';
                }
                else if (route.name === 'Chat') {
                    iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: Colors.text,
            tabBarInactiveTintColor: Colors.secondary,
            headerTitleAlign: 'center', headerTitleStyle: {
                color: Colors.text
            },
            headerStyle: { backgroundColor: Colors.header },
            tabBarStyle: { backgroundColor: Colors.header }
        })}>
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Posts" component={PostStack} options={{ headerShown: false }} />
            <Tab.Screen name="Chat" component={Chat} />
        </Tab.Navigator>
    );
}

export default BottomTabNavigator;
