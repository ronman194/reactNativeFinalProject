import React, { FC, useEffect, useState } from 'react';
import { ScrollView,View, Text, TextInput, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker'
import uploadToCloudinary from '../api/cloudinaryApi';
import PostModel, { Post } from '../models/PostModel';
import Colors from '../tools/Colors';
import Loading from '../Components/Loading';
import {showSuccessToast, showErrorToast} from '../tools/ToastMessage'



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
            console.log(err);
        }
    }

    useEffect(() => {
        askPermission();
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
            }

        } catch (err) {
            console.log(err)
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
            console.log(err)
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
        if(postImage =='' && postText == ''){
            showErrorToast("please provie valid data")
            return;
        }
        if(postText == ''){
            showErrorToast("please provie valid data")
            return;
        }
        setIsLoading(true);
        if (postImage != '') {
            const res = await getImgCloudSrc();
            setCloudSrc(res.data.url);
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
                showSuccessToast('Post Added successfully')
                navigation.navigate('Home')
            } catch (err) {
                showErrorToast("fail to upload a post")
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
                showSuccessToast('Post Added successfully')
                navigation.navigate('Home')
            } catch (err) {
                showErrorToast("fail to upload a post")
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
                                placeholderTextColor={Colors.text}
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
                        <TouchableOpacity style={styles.postButton} onPress={postCallback}>
                            <Text style={{ fontWeight: 'bold', }}>Post</Text>
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
        color: Colors.text
    },
    postButton: {
        alignItems: 'center',
        backgroundColor: Colors.green,
        padding: 10,
        margin: 10,
        borderRadius: 30,
        color: Colors.text
    },
    deleteButton: {
        alignItems: 'center',
        backgroundColor: Colors.delete,
        padding: 10,
        margin: 10,
        borderRadius: 30
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

});

export default AddPostPage;

