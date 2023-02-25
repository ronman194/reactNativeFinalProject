import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useEffect, FC } from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import PostModel from '../models/PostModel';
import Post from '../Components/Post';
// const Post: FC<{ navigation: any, post: any }> =
//     ({ navigation, post }) => {
//         const userEmail = useSelector((state: any) => state.email).toLowerCase();
//         const cliked = () => {
//             console.log("ID " + post._id);
//             navigation.navigate("StudentAdd")
//         }
//         return (
//             <View style={styles.postContainer}>
//                 <View style={styles.header}>
//                     <Image style={styles.avatar} source={{ uri: post.senderProfileImage }} />
//                     <Text style={styles.username}>{post.senderFirstName} {post.senderLastName}</Text>
//                     {userEmail === post.sender &&
//                         <TouchableOpacity onPress={cliked} >
//                             <Text style={styles.editPostButton}>Edit Post</Text>
//                         </TouchableOpacity>}
//                 </View>
//                 {post.postImage && <Image style={styles.postImage} source={{ uri: post.postImage }} />}
//                 <Text style={styles.caption}>{post.message}</Text>
//             </View>
//         );
//     };

const Feed: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [posts, setPosts] = useState<Array<any>>([]);
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
