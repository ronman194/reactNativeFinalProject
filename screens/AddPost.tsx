import Ionicons from '@expo/vector-icons/Ionicons';
import React, { FC, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker'
import uploadToCloudinary from '../api/cloudinaryApi';
import Toast from 'react-native-toast-message';
import PostModel, { Post } from '../models/PostModel';

const AddPostPage: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [postText, setPostText] = useState('');
    const [postImage, setPostImage] = useState('');
    const userEmail = useSelector((state: any) => state.email);
    const userAccessToken = useSelector((state: any) => state.accessToken);
    const profileImage = useSelector((state: any) => state.profileImage);
    const firstName = useSelector((state: any) => state.firstName);
    const lastName = useSelector((state: any) => state.lastName);
    const [imgSrc, setImgSrc] = useState({});
    const [cloudSrc, setCloudSrc] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const askPermission = async () => {
        try {

            const res = await ImagePicker.getCameraPermissionsAsync();
            if (!res.granted) {
                alert("camera permission is required");
            }
        } catch (err) {
            console.log("Ask permission error " + err);
        }
    }

    useEffect(() => {
        askPermission();
        console.log("img src ")
    }, []);

    const openCamera = async () => {
        try {
            const res = await ImagePicker.launchCameraAsync({ base64: true })
            if (!res.canceled && res.assets.length > 0) {
                const uri = res.assets[0].uri
                setPostImage(uri)
                const type = "image/jpg";
                const name = Date.now() + '.jpg';
                const source = { uri, type, name };
                setImgSrc(source);
                console.log(source)
            }

        } catch (err) {
            console.log("open camera error:" + err)
        }
    }

    const openGallery = async () => {
        try {
            const res = await ImagePicker.launchImageLibraryAsync({ base64: true })
            if (!res.canceled && res.assets.length > 0) {
                const uri = res.assets[0].uri;
                setPostImage(uri);
                const type = "image/jpg";
                const name = res.assets[0].fileName;
                const source = { uri, type, name };
                setImgSrc(source);
                console.log(source)
            }

        } catch (err) {
            console.log("open camera error:" + err)
        }
    }

    const getImgCloudSrc = async () => {
        try {
            const imgPath: any = await uploadToCloudinary(imgSrc);
            return imgPath
        } catch (err) {
            console.log(err);
        }
    }
    const deletePhoto = () => {
        setPostImage('');
        setImgSrc({});
    }
    const postCallback = async () => {
        setIsLoading(true);
        if (postImage != '') {
            const res = await getImgCloudSrc();
            console.log("HIIJJJ " + res.data);
            setCloudSrc(res.data.url);
            console.log("PATHHHHHH " + cloudSrc)
            try {
                const post: Post = {
                    message: postText,
                    image: res.data.url,
                    // image: res.data.url,
                    sender: userEmail.toLowerCase(),
                    firstName: firstName,
                    lastName: lastName,
                    profileImage: profileImage
                }
                const us: any = await PostModel.addPost(post, userAccessToken);
                setIsLoading(false);
                navigation.navigate('Posts')
            } catch (err) {
                console.log("fail to update a user: " + err)
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: "fail to upload a post"
                });
                setIsLoading(false);
            }
        }
        else {
            try {
                const post: Post = {
                    message: postText,
                    image: '',
                    // image: res.data.url,
                    sender: userEmail.toLowerCase(),
                    firstName: firstName,
                    lastName: lastName,
                    profileImage: profileImage
                }
                const us: any = await PostModel.addPost(post, userAccessToken);
                setIsLoading(false);
                navigation.navigate('Posts')
            } catch (err) {
                console.log("fail to update a user: " + err)
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: "fail to upload a post"
                });
                setIsLoading(false);
            }
        }
        setPostText('');
        setPostImage('');
        setImgSrc({});
        setCloudSrc('');
        setIsLoading(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView >
                {isLoading && <ActivityIndicator style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center", margin: 5
                }} color={"#0000ff"} size="large" />}
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Image
                            source={{ uri: profileImage }}
                            style={styles.profileImage}
                        />
                        <Text style={styles.username}>{firstName} {lastName}</Text>
                        <TouchableOpacity style={styles.headerButton} onPress={postCallback}>
                            <Text>Post</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>
                        <TextInput
                            placeholder="What's on your mind?"
                            value={postText}
                            onChangeText={setPostText}
                            style={styles.input}
                            multiline
                        />
                        {postImage != '' &&
                            <View>
                                <Image source={{ uri: postImage }} style={styles.imagePreview} />
                                <TouchableOpacity style={styles.deleteButton} onPress={deletePhoto}>
                                    <Text>Delete Photo</Text>
                                </TouchableOpacity>
                            </View>
                        }

                    </View>

                    <TouchableOpacity style={styles.button} onPress={openCamera}>
                        <Text>Upload From Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={openGallery}>
                        <Text>Upload From Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={postCallback}>
                        <Text>Post</Text>
                    </TouchableOpacity>
                    <Toast />
                </View>
            </ScrollView >
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        marginTop: StatusBar.currentHeight
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        margin: 10,
        borderRadius: 30
    },
    deleteButton: {
        alignItems: 'center',
        backgroundColor: '#FF5974',
        padding: 10,
        margin: 10,
        borderRadius: 30
    },
    headerButton: {
        position: 'absolute',
        alignItems: 'center',
        backgroundColor: '#00ADAD',
        padding: 10,
        margin: 10,
        borderRadius: 30,
        bottom: -10,
        right: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        maxHeight: 250,
    },
    imagePreview: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        marginBottom: 10,
        borderRadius: 10,
    },

});

export default AddPostPage;

