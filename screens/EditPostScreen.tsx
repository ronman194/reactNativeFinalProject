import Ionicons from '@expo/vector-icons/Ionicons';
import React, { FC, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker'
import uploadToCloudinary from '../api/cloudinaryApi';
import Toast from 'react-native-toast-message';
import PostModel, { UpdatePost } from '../models/PostModel';
import Colors from '../tools/Colors';
import Loading from '../Components/Loading';
import { showSuccessToast, showErrorToast } from '../tools/ToastMessage'

const EditPostScreen: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const postId = JSON.stringify(route.params.postId)
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
    const [data, setData]: any = useState();

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
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            setIsLoading(true);
            try {
                const post = await PostModel.getPostById(postId, userAccessToken);
                setData(post.post);
                setPostText(post.post.message)
                if (post.post.postImage != "") {
                    setPostImage(post.post.postImage)
                }
                setIsLoading(false);
            } catch (err) {
                console.log("fail fetching post " + err);
                setIsLoading(false);
            }
            setIsLoading(false);
        })
        return unsubscribe;
    }, [])

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
    const deleteHandler = async () => {
        setIsLoading(true);
        try {
            await PostModel.deletePostById(postId, userAccessToken);
            setIsLoading(false);
            showSuccessToast('Delete Post')
            navigation.navigate('Home');
        } catch (err) {
            console.log("fail to delete a post: " + err);
            showErrorToast('Fail to delete a post');
            setIsLoading(false);
        }

    }
    const deletePost = () => {
        Alert.alert('Delete Posr', 'Are you sure you want to delete this post?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'Delete', onPress: deleteHandler },
        ]);
    }

    const updateCallback = async () => {
        if(data.postImage == postImage && data.message == postText){
            showErrorToast("Nothing to Update")
            return
        }
        setIsLoading(true);
        if (postImage != '' && postImage != data.postImage) {
            const res = await getImgCloudSrc();
            setCloudSrc(res.data.url);
            try {
                const post: UpdatePost = {
                    message: postText,
                    updateImage: res.data.url,
                }
                const us: any = await PostModel.updatePost(postId, userAccessToken, post);
                setIsLoading(false);
                showSuccessToast('Update Successful')
                navigation.navigate('Posts')
            } catch (err) {
                console.log("fail to update a user: " + err)
                showErrorToast('Fail to update a post');
                setIsLoading(false);
            }
        }
        else {
            try {
                const post: UpdatePost = {
                    message: postText,
                    updateImage: postImage,
                }
                const us: any = await PostModel.updatePost(postId, userAccessToken, post);
                setIsLoading(false);
                showSuccessToast('Update Successful')
                navigation.navigate('Posts')
            } catch (err) {
                console.log("fail to update a user: " + err)
                showErrorToast('Fail to update a post');
                setIsLoading(false);
            }
        }
        setPostText('');
        setPostImage('');
        setImgSrc({});
        setCloudSrc('');
        setIsLoading(false);
        navigation.navigate("Home")
    }

    return (
        <SafeAreaView style={styles.container}>
            {isLoading ? <Loading /> :
                <ScrollView >

                    <View style={styles.container}>
                        <View style={styles.header}>
                            {
                                profileImage === '../assets/user.png' ?
                                    <Image style={styles.profileImage} source={require('../assets/user.png')} /> :
                                    <Image style={styles.profileImage} source={{ uri: profileImage }} />
                            }
                            <Text style={styles.username}>{firstName} {lastName}</Text>
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
                            <Text style={styles.buttonText}>Upload From Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={openGallery}>
                            <Text style={styles.buttonText}>Upload From Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.updateButton} onPress={updateCallback}>
                            <Text style={styles.updateButtonText}>Update</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={deletePost} >
                            <Ionicons name={'trash'} color={Colors.delete} style={styles.deletePostButton} size={40} />
                        </TouchableOpacity>
                    </View>
                </ScrollView >
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 10,
    },
    button: {
        alignItems: 'center',
        backgroundColor: Colors.blue,
        padding: 10,
        margin: 10,
        borderRadius: 30,
    },
    updateButton: {
        alignItems: 'center',
        backgroundColor: Colors.green,
        padding: 10,
        margin: 10,
        borderRadius: 30,
    },
    deleteButton: {
        alignItems: 'center',
        backgroundColor: Colors.delete,
        padding: 10,
        margin: 10,
        borderRadius: 30
    },
    deletePostButton: {
        alignItems: 'center',
        alignSelf: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10
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
        color: Colors.text
    },
    content: {
        flex: 1,
    },
    input: {
        borderWidth: 1,
        color: Colors.text,
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
    buttonText: {
        textAlign: 'center',
        color: 'white'
    },
    updateButtonText: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
});

export default EditPostScreen;

