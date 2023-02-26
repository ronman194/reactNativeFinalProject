import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useEffect, FC } from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import PostModel from '../models/PostModel';
import Post from '../Components/Post';
import Colors from '../tools/Colors';

const MyPosts: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [posts, setPosts] = useState<Array<any>>([]);
    const userAccessToken = useSelector((state: any) => state.accessToken);
    const userEmail = useSelector((state: any) => state.email).toLowerCase();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            try {
                const postsList = await PostModel.getAllPostsBySender(userEmail, userAccessToken);
                setPosts(postsList.reverse())
            } catch (err) {
                console.log("fail fetching students " + err);
            }
        })
        return unsubscribe;
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <FlatList
                    data={posts}
                    renderItem={({ item }) => <Post post={item} navigation={navigation} />}
                    keyExtractor={item => item._id.toString()}
                />
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
        padding: 10,
        // marginTop: StatusBar.currentHeight
    },
});

export default MyPosts;
