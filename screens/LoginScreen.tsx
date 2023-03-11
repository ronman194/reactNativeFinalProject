import { useState, FC, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, TextInput, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import store from '../redux/store';
import Colors from '../tools/Colors';
import UserModel, { loginUser } from '../models/UserModel';
import {showSuccessToast, showErrorToast} from '../tools/ToastMessage'

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

                showSuccessToast(`Login as ${email.toLocaleLowerCase()}`)
                setEmail("");
                setPassword("");
            }
            else {
                showErrorToast(us.data.err)
            }
        } catch (err) {
            console.log("fail login to user: " + err)
            showErrorToast('fail login to user')
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView keyboardVerticalOffset={100} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.inputContainer}>
                    <Ionicons name={'mail'} style={styles.inputIcon} size={30} />
                    <TextInput
                        style={styles.inputs}
                        onChangeText={setEmail}
                        value={email}
                        placeholder={'Enter Email'}
                        placeholderTextColor={Colors.text}
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
                        placeholderTextColor={Colors.text}
                        secureTextEntry={true}
                        underlineColorAndroid="transparent"
                    />
                </View>
            </KeyboardAvoidingView>
            <TouchableOpacity onPress={onSaveCallback} style={[styles.buttonContainer, styles.loginButton]}
            >
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => { navigation.navigate("Signup") }}>
                <Text style={styles.signuptext}
                >Sign up</Text>
            </TouchableOpacity>
            {/* <Toast /> */}

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    inputContainer: {
        borderBottomColor: Colors.text,
        backgroundColor: Colors.primary,
        borderRadius: 30,
        width: 250,
        height: 45,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputs: {
        height: 45,
        marginLeft: 16,
        flex: 1,
        color: Colors.text,
    },
    inputIcon: {
        width: 30,
        height: 30,
        marginLeft: 15,
        justifyContent: 'center',
        color: Colors.text
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
        backgroundColor: Colors.blue,
    },
    loginText: {
        color: Colors.text,
    },
    signuptext: {
        color: Colors.pink
    }
});

export default LoginScreen
