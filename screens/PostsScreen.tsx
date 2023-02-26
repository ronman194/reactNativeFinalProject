import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useEffect, FC } from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import PostModel from '../models/PostModel';
import Post from '../Components/Post';

const Feed: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [posts, setPosts] = useState<Array<any>>([]);
    const userAccessToken = useSelector((state: any) => state.accessToken);


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            try {
                const postsList = await PostModel.getAllPosts(userAccessToken);
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
        backgroundColor: '#f0f0f0',
        padding: 10,
        // marginTop: StatusBar.currentHeight

    },
    postContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 15,
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    username: {
        fontWeight: 'bold',
    },
    postImage: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    caption: {
        fontSize: 16,
    },
    editPostButton: {
        fontWeight: 'bold',
        alignSelf: 'flex-end',
        marginLeft: 120
    }
});

export default Feed;
