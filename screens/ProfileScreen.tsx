import { FC, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, TextInput, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import UserModel, { UpdateUser } from '../models/UserModel';
import * as ImagePicker from 'expo-image-picker'
import Ionicons from '@expo/vector-icons/Ionicons';
import uploadToCloudinary from '../api/cloudinaryApi';
import store from '../redux/store';
import Colors from '../tools/Colors';
import Loading from '../Components/Loading';
import { showSuccessToast, showErrorToast } from '../tools/ToastMessage'




const ProfileScreen: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const userEmail = useSelector((state: any) => state.email);
    const userFirstName = useSelector((state: any) => state.firstName);
    const userLastName = useSelector((state: any) => state.lastName);
    const userAccessToken = useSelector((state: any) => state.accessToken);
    const userRefreshToken = useSelector((state: any) => state.refreshToken);
    const profileImage = useSelector((state: any) => state.profileImage);
    const [profileImageUri, setProfileImageUri] = useState(profileImage)
    const [firstName, setFirstName] = useState(userFirstName)
    const [lastName, setLastName] = useState(userLastName)
    const [imgSrc, setImgSrc] = useState({});
    const [cloudSrc, setCloudSrc] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [update, setUpdate] = useState(false);



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
                setProfileImageUri(uri)
                const type = "image/jpg";
                const name = Date.now() + '.jpg';
                const source = { uri, type, name };
                setImgSrc(source);
                setUpdate(true)
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
                setProfileImageUri(uri);
                const type = "image/jpg";
                const name = res.assets[0].fileName;
                const source = { uri, type, name };
                setImgSrc(source);
                setUpdate(true)
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

    const onSaveCallback = async () => {
        if (userFirstName == firstName && userLastName == lastName && !update) {
            showErrorToast('Nothing to update in profile')
            return
        }
        setIsLoading(true);
        if (update) {
            const res = await getImgCloudSrc();
            setCloudSrc(res.data.url);
            try {
                store.dispatch({
                    type: 'UPDATE_USER', accessToken: userAccessToken,
                    refreshToken: userRefreshToken, email: userEmail,
                    firstName: firstName, lastName: lastName,
                    profileImage: res.data.url
                });
                const user: UpdateUser = {
                    firstName: firstName,
                    lastName: lastName,
                    email: userEmail,
                    profileImage: res.data.url
                }
                const us: any = await UserModel.updateUser(user, userAccessToken);
                setIsLoading(false);
                showSuccessToast("Profile Update")
                navigation.navigate("Posts")
                setUpdate(false)
            } catch (err) {
                console.log("fail to update a user: " + err)
                showErrorToast('Fail to update profile')
                setIsLoading(false);
            }
        }
        else {
            try {
                store.dispatch({
                    type: 'UPDATE_USER', accessToken: userAccessToken,
                    refreshToken: userRefreshToken, email: userEmail,
                    firstName: firstName, lastName: lastName,
                    profileImage: profileImage
                });
                const user: UpdateUser = {
                    firstName: firstName,
                    lastName: lastName,
                    email: userEmail,
                    profileImage: profileImage
                }
                const us: any = await UserModel.updateUser(user, userAccessToken);
                setIsLoading(false);
                showSuccessToast("Profile Update")
                navigation.navigate("Posts")
            } catch (err) {
                console.log("fail to update a user: " + err)
                showErrorToast('Fail to update profile')
                setIsLoading(false);
            }
        }
        setIsLoading(false);

    }

    const onLogoutCallback = async () => {
        setIsLoading(true);
        try {
            store.dispatch({ type: 'LOGOUT' });
            await UserModel.logout(userRefreshToken);
            setIsLoading(false);
            showSuccessToast("Logout Success")
        } catch (err) {
            console.log("fail to update a user: " + err)
            showErrorToast('Fail to logout')
            setIsLoading(false);
        }
        setIsLoading(false);

    }

    return (
        <SafeAreaView style={styles.container}>
            {isLoading ? <Loading /> :
                <ScrollView style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                            <View style={styles.container}>
                                {profileImage === "../assets/user.png" ? <Image source={require('../assets/user.png')} style={styles.imageProfile}></Image> :
                                    profileImage === profileImageUri ? <Image source={{ uri: profileImage }} style={styles.imageProfile}></Image> :
                                        <Image source={{ uri: profileImageUri }} style={styles.imageProfile}></Image>}
                                <TouchableOpacity onPress={openCamera} >
                                    <Ionicons name={'camera'} style={styles.cameraButton} size={50} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={openGallery} >
                                    <Ionicons name={'image'} style={styles.galleryButton} size={50} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.inputTitle}>First Name:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setFirstName}
                                value={firstName}
                                placeholder={'Enter your first name'}
                            />
                            <Text style={styles.inputTitle}>Last Name:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setLastName}
                                value={lastName}
                                placeholder={'Enter your last name'}
                            />
                            <TouchableOpacity disabled={isLoading} onPress={onSaveCallback} style={styles.updateButton}>
                                <Text style={styles.buttonText}>UPDATE</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={isLoading} onPress={onLogoutCallback} style={styles.logoutButton}>
                                <Text style={styles.buttonText}>Log Out</Text>
                            </TouchableOpacity>
                        </KeyboardAvoidingView>

                    </View>
                </ScrollView>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.background
    },
    imageProfile: {
        height: 250,
        alignSelf: 'center',
        width: 250,
        marginBottom: 30,
        borderRadius: 150,
        marginTop: 10
    },
    cameraButton: {
        position: 'absolute',
        bottom: -10,
        left: 10,
        width: 50,
        height: 50,
        color: Colors.text
    },
    galleryButton: {
        position: 'absolute',
        bottom: -10,
        right: 10,
        width: 50,
        height: 50,
        color: Colors.text
    },
    input: {
        height: 40,
        margin: 8,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        textAlign: 'center',
        color: Colors.text,
        borderColor: '#ccc',
    },
    inputTitle: {
        marginTop: 5,
        fontWeight: 'bold',
        fontSize: 26,
        textAlign: 'center',
        color: Colors.text
    },

    buttonText: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
    updateButton: {
        flex: 1,
        margin: 12,
        padding: 12,
        backgroundColor: Colors.green,
        borderRadius: 10,
        width: 200,
        alignSelf: 'center'
    },
    logoutButton: {
        flex: 1,
        margin: 12,
        padding: 12,
        backgroundColor: Colors.delete,
        borderRadius: 10,
        width: 200,
        alignSelf: 'center'
    }
});

export default ProfileScreen