import { FC, useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, Image, TouchableOpacity, Button, Alert, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import UserModel, { UpdateUser } from '../models/UserModel';
import * as ImagePicker from 'expo-image-picker'
import Ionicons from '@expo/vector-icons/Ionicons';
import uploadToCloudinary from '../api/cloudinaryApi';
import store from '../redux/store';
import Toast from 'react-native-toast-message';



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
                setProfileImageUri(uri);
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
            // setProfileImageUri(imgPath.data.url);
            console.log("pathhhh " + cloudSrc)
            return imgPath
        } catch (err) {
            console.log(err);
        }
    }

    const onSaveCallback = async () => {
        setIsLoading(true);
        const res = await getImgCloudSrc();
        setCloudSrc(res.data.url);
        console.log("PATHHHHHH " + cloudSrc)
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
            navigation.goBack()
        } catch (err) {
            console.log("fail to update a user: " + err)
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: "fail to update a user"
            });
            setIsLoading(false);
        }
    }

    const onCancellCallback = () => {
        setFirstName(userFirstName);
        setLastName(userLastName);
        setCloudSrc(profileImage);
        setProfileImageUri(profileImage);
    }

    return (
        <ScrollView>
            <View style={{ flex: 1, justifyContent: 'center', }}>
                {isLoading && <ActivityIndicator style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",margin:5
                }} color={"#0000ff"} size="large" />}
                <View>
                    {profileImage === "../assets/user.png" && <Image source={require('../assets/user.png')} style={styles.imageProfile}></Image>}
                    {profileImage === profileImageUri ? <Image source={{ uri: profileImage }} style={styles.imageProfile}></Image> :
                        <Image source={{ uri: profileImageUri }} style={styles.imageProfile}></Image>}
                    {/* {profileImage != "../assets/user.png" && <Image source={{ uri: profileImage }} style={styles.imageProfile}></Image>} */}
                    {/* {profileImageUri === "../assets/user.png" && <Image source={require('../assets/user.png')} style={styles.imageProfile}></Image>}
                    {profileImageUri != "../assets/user.png" && <Image source={{ uri: profileImageUri }} style={styles.imageProfile}></Image>} */}
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

                <View style={styles.buttonesContainer}>
                    <TouchableOpacity disabled={isLoading} onPress={onCancellCallback} style={styles.button}>
                        <Text style={styles.buttonText}>CANCELL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={isLoading} onPress={onSaveCallback} style={styles.button}>
                        <Text style={styles.buttonText}>UPDATE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    imageProfile: {
        height: 300,
        alignSelf: 'center',
        width: 300,
        marginTop: 25,
        marginBottom: 30,
        borderRadius: 150,
    },
    cameraButton: {
        position: 'absolute',
        bottom: -10,
        left: 10,
        width: 50,
        height: 50,
    },
    galleryButton: {
        position: 'absolute',
        bottom: -10,
        right: 10,
        width: 50,
        height: 50,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        textAlign: 'center'
    },
    inputTitle: {
        marginTop: 20,
        padding: 10,
        fontWeight: 'bold',
        fontSize: 26,
        textAlign: 'center'
    },
    buttonesContainer: {
        flexDirection: 'row',
    },
    button: {
        flex: 1,
        margin: 12,
        padding: 12,
        backgroundColor: 'blue',
        borderRadius: 10,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white'
    }
});

export default ProfileScreen