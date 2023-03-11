import { useState, FC } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import UserModel, { User } from '../models/UserModel';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import Colors from '../tools/Colors';



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
                    placeholderTextColor={Colors.text}
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
                    placeholderTextColor={Colors.text}
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
            <TouchableOpacity onPress={onSaveCallback} style={[styles.buttonContainer, styles.loginButton]}
            >
                <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{}}
                onPress={() => { navigation.navigate("Login") }}>
                <Text style={styles.loginText}>Login</Text>
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
        backgroundColor: '#00b5ec',
    },
    loginText: {
        color: Colors.pink,
    },
    signupText: {
        color: Colors.text,
    },
});

export default SignupScreen
