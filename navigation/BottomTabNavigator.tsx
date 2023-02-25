import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import StudentList from '../screens/StudentsList';
import StudentAdd from '../screens/StudentAdd';
import ProfileScreen from '../screens/ProfileScreen';
import AddPost from '../screens/AddPost';
import Feed from '../screens/PostsScreen';
import PostStack from './PostStack';


const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
    const navigation = useNavigation();

    return (
        <Tab.Navigator initialRouteName="Posts" screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName: any = "";
                if (route.name === 'StudentList') {
                    iconName = focused
                        ? 'information-circle'
                        : 'information-circle-outline';
                } 
                else if (route.name === 'StudentAdd') {
                    iconName = focused ? 'list-circle' : 'list-circle-outline';
                }
                else if (route.name === 'Profile') {
                    iconName = focused ? 'person-circle' : 'person-circle-outline';
                }
                else if (route.name === 'AddPost') {
                    iconName = focused ? 'add' : 'add-outline';
                }
                else if (route.name === 'Posts') {
                    iconName = focused ? 'home' : 'home-outline';
                }
                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'blue',
            headerShown: false,
        })}>

            <Tab.Screen name="StudentList" component={StudentList} />
            <Tab.Screen name="StudentAdd" component={StudentAdd} />
            <Tab.Screen name="Posts" component={PostStack} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="AddPost" component={AddPost} />
        </Tab.Navigator>
    );
}

export default BottomTabNavigator;
