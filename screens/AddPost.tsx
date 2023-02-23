// import { useState, FC, useEffect } from 'react';
// import { StyleSheet, Text, View, Image, TouchableOpacity, Keyboard, Alert, TextInput, ScrollView } from 'react-native';
// import Ionicons from '@expo/vector-icons/Ionicons';

// import PostModel, { Post } from '../models/PostModel';
// import * as ImagePicker from 'expo-image-picker'
// import { useSelector } from 'react-redux';
// import StudentModel from '../models/StudentModel';

// const AddPost: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
//     console.log("My app is running");
//     const [message, setMessage] = useState("");
//     const [postUri, setPostUri] = useState("");
//     const userEmail = useSelector((state: any) => state.email);
//     const userAccessToken = useSelector((state: any) => state.accessToken);
//     const profileImage = useSelector((state: any) => state.profileImage);



//     const askPermission = async () => {
//         try {
//             const res = await ImagePicker.getCameraPermissionsAsync();
//             if (!res.granted) {
//                 alert("camera permission is required");
//             }
//         } catch (err) {
//             console.log("Ask permission error " + err);
//         }
//     }

//     useEffect(() => {
//         askPermission();
//     }, []);

//     const openCamera = async () => {
//         try {
//             const res = await ImagePicker.launchCameraAsync()
//             if (!res.canceled && res.assets.length > 0) {
//                 const uri = res.assets[0].uri
//                 setPostUri(uri)
//             }

//         } catch (err) {
//             console.log("open camera error:" + err)
//         }
//     }

//     const openGallery = async () => {
//         try {
//             const res = await ImagePicker.launchImageLibraryAsync()
//             if (!res.canceled && res.assets.length > 0) {
//                 const uri = res.assets[0].uri
//                 setPostUri(uri)
//             }

//         } catch (err) {
//             console.log("open camera error:" + err)
//         }
//     }

//     const onSaveCallback = async () => {
//         console.log("button was pressed")
//         const post: Post = {
//             message: message,
//             sender: userEmail,
//             image: postUri,
//         }
//         try {
//             if (postUri != "") {
//                 console.log("uploading image")
//                 const url = await StudentModel.uploadImage(postUri)
//                 post.image = url
//                 console.log("got url from upload: " + url)
//             }
//             console.log("saving stundet")
//             console.log("saving post")
//             await PostModel.addPost(post, userAccessToken)
//             setMessage("");
//             setPostUri("");
//         } catch (err) {
//             console.log("fail adding post: " + err)
//         }
//         navigation.goBack()

//     }

//     const onCancellCallback = () => {
//         navigation.goBack();
//     }

//     return (
//         <ScrollView>
//             <View style={styles.container}>
//                 <View>
//                     {postUri == "" && <Image source={require('../assets/ava.png')} style={styles.avatar}></Image>}
//                     {postUri != "" && <Image source={{ uri: postUri }} style={styles.avatar}></Image>}

//                     <TouchableOpacity onPress={openCamera} >
//                         <Ionicons name={'camera'} style={styles.cameraButton} size={50} />
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={openGallery} >
//                         <Ionicons name={'image'} style={styles.galleryButton} size={50} />
//                     </TouchableOpacity>
//                 </View>
//                 <TextInput
//                     multiline
//                     numberOfLines={3}
//                     style={styles.input}
//                     onChangeText={setMessage}
//                     value={message}
//                     placeholder={'Enter your post details...'}
//                     returnKeyType='done'
//                     autoFocus={true}
//                     onSubmitEditing={Keyboard.dismiss}
//                     />

//                 <View style={styles.buttonesContainer}>
//                     <TouchableOpacity onPress={onCancellCallback} style={styles.button}>
//                         <Text style={styles.buttonText}>CANCELL</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={onSaveCallback} style={styles.button}>
//                         <Text style={styles.buttonText}>SAVE</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </ScrollView>
//     );
// }


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     avatar: {
//         height: 250,
//         resizeMode: "contain",
//         alignSelf: 'center',
//         width: '100%'
//     },
//     cameraButton: {
//         position: 'absolute',
//         bottom: -10,
//         left: 10,
//         width: 50,
//         height: 50,
//     },
//     galleryButton: {
//         position: 'absolute',
//         bottom: -10,
//         right: 10,
//         width: 50,
//         height: 50,
//     },
//     input: {
//         height: 240,
//         margin: 12,
//         borderWidth: 1,
//         padding: 10,
//         borderRadius: 5,
//     },
//     buttonesContainer: {
//         flexDirection: 'row',
//     },
//     button: {
//         flex: 1,
//         margin: 12,
//         padding: 12,
//         backgroundColor: 'blue',
//         borderRadius: 10,
//     },
//     buttonText: {
//         textAlign: 'center',
//         color: 'white'
//     }
// });

// export default AddPost

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
    }, []);

    const openCamera = async () => {
        try {
            const res = await ImagePicker.launchCameraAsync({ base64: true })
            if (!res.canceled && res.assets.length > 0) {
                const uri = res.assets[0].uri
                setPostImage(uri)
                const type = "image/jpg";
                const name = Date.now()+'.jpg';
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
        const res = await getImgCloudSrc();
        console.log("HIIJJJ " + res.data);
        setCloudSrc(res.data.url);
        console.log("PATHHHHHH " + cloudSrc)
        try {
            const post: Post = {
                message: postText,
                image: res.data.url,
                sender: userEmail.toLowerCase(),
                firstName: firstName,
                lastName: lastName,
                profileImage: profileImage
            }
            const us: any = await PostModel.addPost(post, userAccessToken);
            setIsLoading(false);
            navigation.goBack()
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

