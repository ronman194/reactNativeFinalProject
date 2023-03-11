import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Feed from '../screens/PostsScreen';
import { TouchableOpacity, Text } from 'react-native';
import MyPosts from '../screens/MyPosts';
import Ionicons from '@expo/vector-icons/Ionicons';
import EditPostScreen from '../screens/EditPostScreen';
import Colors from '../tools/Colors';
import UserPostsScreen from '../screens/UserPostsScreen';
import AddPostPage from '../screens/AddPost';



const Stack = createNativeStackNavigator();

const PostStack: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {

    const myPostHandler = () => {
        navigation.navigate('MyPost')
    }
    const addPostHandler = () => {
        navigation.navigate('AddPost')
    }
    return (
        <Stack.Navigator screenOptions={{
            headerTitleAlign: 'center', headerTitleStyle: {
                color: Colors.text
            },
            headerStyle: { backgroundColor: Colors.header },
            headerTintColor: Colors.blue,
        }}>
            <Stack.Screen
                name={"Home"}
                component={Feed}
                options={{
                    headerTitle: "Feed",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={myPostHandler}>
                            <Text style={{ fontWeight: 'bold', color: Colors.blue }}>My Posts</Text>
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={addPostHandler}>
                            <Ionicons name={'add-circle'} color={Colors.green} size={25} />
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
            <Stack.Screen
                name={"AddPost"}
                component={AddPostPage}
                options={{ headerTitle: "Add Posts" }}
            />
            <Stack.Screen
                name={"UserPosts"}
                component={UserPostsScreen}
                options={({ route }) => ({ title: (route.params as { userEmail: string }).userEmail + ' Posts' })}
            />
        </Stack.Navigator>
    );
}

export default PostStack;