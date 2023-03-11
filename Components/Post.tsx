import Ionicons from '@expo/vector-icons/Ionicons';
import React, { FC, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../tools/Colors';



const Post: FC<{ navigation: any, post: any }> =
    ({ navigation, post }) => {
        const userEmail = useSelector((state: any) => state.email).toLowerCase();
        const [modalVisible, setModalVisible] = useState(false);

        const cliked = () => {
            navigation.navigate("EditPost", { postId: post._id })
        }

        const profileImageClicked = () => {
            navigation.navigate("UserPosts", { userEmail: post.sender })
        }

        const handleImagePress = () => {
            setModalVisible(true);
        };

        return (
            <View style={styles.postContainer}>
                <View style={styles.header}>
                    {post.senderProfileImage === '../assets/user.png' ?
                        <TouchableOpacity onPress={profileImageClicked}>
                            <Image style={styles.avatar} source={require('../assets/user.png')} />
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={profileImageClicked}>
                            <Image style={styles.avatar} source={{ uri: post.senderProfileImage }} />
                        </TouchableOpacity>}
                    <Text style={styles.username}>{post.senderFirstName} {post.senderLastName}</Text>
                    {userEmail === post.sender &&
                        <TouchableOpacity onPress={cliked} >
                            <Text style={styles.editPostButton}>Edit Post</Text>
                        </TouchableOpacity>}
                </View>
                <Text style={styles.caption}>{post.message}</Text>
                {post.postImage && 
                <><TouchableOpacity onPress={handleImagePress}>
                        <Image
                            style={styles.postImage}
                            source={{ uri: post.postImage }} />
                    </TouchableOpacity><Modal visible={modalVisible} transparent={true}>
                            <TouchableOpacity
                                style={styles.modal}
                                onPress={() => setModalVisible(false)}
                            >
                                <Image
                                    style={styles.modalImage}
                                    source={{ uri: post.postImage }} />
                            </TouchableOpacity>
                        </Modal></>
                }
            </View>
        );
    };

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: Colors.header,
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 15,
        padding: 10,
        width:300,
        alignSelf:'center'
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
        color: Colors.text,
    },
    postImage: {
        width:'95%',
        height: 250,
        marginBottom: 10,
        resizeMode:'stretch',
        alignSelf:'center'
    },
    caption: {
        fontSize: 16,
        color: Colors.text,
        marginBottom:10
    },
    editPostButton: {
        fontWeight: 'bold',
        alignSelf: 'flex-end',
        marginLeft: 80,
        color: Colors.text
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
      },
      modalImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
      },
});

export default Post;
