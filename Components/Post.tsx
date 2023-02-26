import React, { FC } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

const Post: FC<{ navigation: any, post: any }> =
    ({ navigation, post }) => {
        const userEmail = useSelector((state: any) => state.email).toLowerCase();
        const cliked = () => {
            console.log("ID " + post._id);
            navigation.navigate("EditPost", { postId: post._id})
        }
        return (
            <View style={styles.postContainer}>
                <View style={styles.header}>
                    <Image style={styles.avatar} source={{ uri: post.senderProfileImage }} />
                    <Text style={styles.username}>{post.senderFirstName} {post.senderLastName}</Text>
                    {userEmail === post.sender &&
                        <TouchableOpacity onPress={cliked} >
                            <Text style={styles.editPostButton}>Edit Post</Text>
                        </TouchableOpacity>}
                </View>
                {post.postImage && <Image style={styles.postImage} source={{ uri: post.postImage }} />}
                <Text style={styles.caption}>{post.message}</Text>
            </View>
        );
    };

const styles = StyleSheet.create({
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

export default Post;
