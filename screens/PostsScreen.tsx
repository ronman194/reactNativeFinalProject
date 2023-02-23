import React, { useState, useEffect, FC } from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import PostModel, { PostDetails } from '../models/PostModel';

const Post: FC<{ post: any }> =
    ({ post }) => {
        return (
            <View style={styles.postContainer}>
                <View style={styles.header}>
                    <Image style={styles.avatar} source={{ uri: post.senderProfileImage }} />
                    <Text style={styles.username}>{post.senderFirstName} {post.senderLastName}</Text>
                </View>
                {post.postImage && <Image style={styles.postImage} source={{ uri: post.postImage }} />}
                <Text style={styles.caption}>{post.message}</Text>
            </View>
        );
    };

const Feed: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [posts, setPosts] = useState([]);
    const userAccessToken = useSelector((state: any) => state.accessToken);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            console.log('focus')
            try {
                const postsList = await PostModel.getAllPosts(userAccessToken);
                setPosts(postsList.reverse())
                console.log("fetching students complete");
            } catch (err) {
                console.log("fail fetching students " + err);
            }
            console.log("fetching finish");
            console.log("Posts :")
            console.log(posts)
        })
        return unsubscribe;
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <FlatList
                    data={posts}
                    renderItem={({ item }) => <Post post={item} />}
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
    },
    postContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal:15,
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
});

export default Feed;
