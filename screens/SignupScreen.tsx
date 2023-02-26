import { useState, FC, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Button, Alert, TextInput, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import UserModel, { User } from '../models/UserModel';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import store from '../redux/store';



const SignupScreen: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {

    const isLoggedIn = useSelector((state: any) => state.isLoggedIn);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const showToast = () => {
        Toast.show({
            type: 'success',
            text1: 'Hello',
            text2: 'This is some something 👋'
        });
    }

    const onSaveCallback = async () => {
        const user: User = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            profileImage: "../assets/user.png"
        }
        try {
            const us: any = await UserModel.registerUser(user);
            if (us.status === 200) {
                navigation.push('Login');
                showToast();
            }
            else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: us.data.err
                });
            }
        } catch (err) {
            console.log("fail register user: " + err)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Ionicons name={'text'} style={styles.inputIcon} size={30} />
                <TextInput
                    style={styles.inputs}
                    onChangeText={setFirstName}
                    value={firstName}
                    placeholder={'First Name'}
                    underlineColorAndroid="transparent"
                />
            </View>

            <View style={styles.inputContainer}>
                <Ionicons name={'text'} style={styles.inputIcon} size={30} />
                <TextInput
                    style={styles.inputs}
                    onChangeText={setLastName}
                    value={lastName}
                    placeholder={'Last Name'}
                    underlineColorAndroid="transparent"
                />
            </View>

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
                <Text style={styles.loginText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{}}
                onPress={() => { navigation.navigate("Login") }}>
                <Text>Login</Text>
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

export default SignupScreen
