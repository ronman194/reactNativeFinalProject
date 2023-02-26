import { useState, FC, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Button, Alert, TextInput, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import store from '../redux/store';

import UserModel, { loginUser } from '../models/UserModel';
import Toast from 'react-native-toast-message';

const LoginScreen: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSaveCallback = async () => {
        const user: loginUser = {
            email: email,
            password: password,
        }
        try {
            const us: any = await UserModel.loginUser(user);
            if (us.status === 200) {
                store.dispatch({
                    type: 'LOGIN', accessToken: us.data.tokens.accessToken,
                    refreshToken: us.data.tokens.refreshToken, email: user.email,
                    firstName: us.data.user.firstName, lastName: us.data.user.lastName,
                    profileImage: us.data.user.profileImage
                });
                navigation.navigate('Home');
                Toast.show({
                    type: 'info',
                    text1: `Login as ${email}`
                });
                setEmail("");
                setPassword("");
            }
            else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: us.data.err
                });
            }
        } catch (err) {
            console.log("fail login to user: " + err)
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: "fail login to user"
            });
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Ionicons name={'mail'} style={styles.inputIcon} size={30} />
                <TextInput
                    style={styles.inputs}
                    onChangeText={setEmail}
                    value={email}
                    placeholder={'Enter Email'}
                    underlineColorAndroid="transparent"
                />
            </View>
            <View style={styles.inputContainer}>
                <Ionicons name={'key'} style={styles.inputIcon} size={30} />
                <TextInput
                    style={styles.inputs}
                    onChangeText={setPassword}
                    value={password}
                    placeholder={'Enter Password'}
                    secureTextEntry={true}
                    underlineColorAndroid="transparent"
                />
            </View>
            <TouchableOpacity onPress={onSaveCallback} style={[styles.buttonContainer, styles.loginButton]}
            >
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{}}
                onPress={() => { navigation.navigate("Signup") }}>
                <Text>Sign up</Text>
            </TouchableOpacity>
            <Toast />

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DCDCDC',
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        borderBottomWidth: 1,
        width: 250,
        height: 45,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputs: {
        height: 45,
        marginLeft: 16,
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    inputIcon: {
        width: 30,
        height: 30,
        marginLeft: 15,
        justifyContent: 'center',
    },
    buttonContainer: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
    },
    loginButton: {
        backgroundColor: '#00b5ec',
    },
    loginText: {
        color: 'white',
    },
});

export default LoginScreen
