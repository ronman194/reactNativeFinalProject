import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Feed from '../screens/PostsScreen';
import { TouchableOpacity, Text } from 'react-native';
import MyPosts from '../screens/MyPosts';
import Ionicons from '@expo/vector-icons/Ionicons';
import EditPostScreen from '../screens/EditPostScreen';



const Stack = createNativeStackNavigator();
// Navigator, Screen, Group

const PostStack: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {

    const myPostHandler = () => {
        navigation.navigate('MyPost')
    }
    const addPostHandler = () => {
        navigation.navigate('AddPost')
    }
    return (
        <Stack.Navigator screenOptions={{ headerTitleAlign: 'center', }}>
            <Stack.Screen
                name={"Home"}
                component={Feed}
                options={{
                    headerTitle: "Feed",
                    headerStyle: {
                        backgroundColor: '#f4511e',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={myPostHandler}>
                            <Text>My Posts</Text>
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={addPostHandler}>
                            <Ionicons name={'add-circle'} color={'#ac22ff'} size={25} />
                        </TouchableOpacity>
                    )
                }}
            />
            <Stack.Screen
                name={"MyPost"}
                component={MyPosts}
                options={{ headerTitle: "My Posts" }}
            />
            <Stack.Screen
                name={"EditPost"}
                component={EditPostScreen}
                options={{ headerTitle: "Edit Posts" }}
            />
        </Stack.Navigator>
    );
}

export default PostStack;