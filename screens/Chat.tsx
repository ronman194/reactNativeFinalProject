import React, { useState, useEffect, FC } from 'react';
import { FlatList, KeyboardAvoidingView, TextInput, TouchableOpacity, StyleSheet, Text, View, Image, Platform, ImageBackground } from 'react-native';
import * as io from 'socket.io-client';
import { DefaultEventsMap } from "@socket.io/component-emitter";
import Client, { Socket } from "socket.io-client";
import { useSelector } from 'react-redux';
import Colors from '../tools/Colors';



//const socket = io('http://localhost:4000');
let socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;

const Chat: FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
    const [messages, setMessages] = useState<Array<any>>();
    const [text, setText] = useState('');
    const userEmail = useSelector((state: any) => state.email);
    const userFirstName = useSelector((state: any) => state.firstName);
    const userLastName = useSelector((state: any) => state.lastName);
    const userAccessToken = useSelector((state: any) => state.accessToken);
    const userRefreshToken = useSelector((state: any) => state.refreshToken);
    const profileImage = useSelector((state: any) => state.profileImage);


    const clientSocketConnect = (
        clientSocket: Socket<DefaultEventsMap, DefaultEventsMap>
    ): Promise<string> => {
        return new Promise((resolve) => {
            clientSocket.on("connect", () => {
                resolve("1");
            });
        });
    };

    const connectUser = async () => {
        socket = Client("http://192.168.0.35:3000", {
            auth: {
                token: "barrer " + userAccessToken,
            },
        });
        await clientSocketConnect(socket);
        return socket;
    };

    useEffect(() => {
        const subscribe = navigation.addListener("focus", async () => {
            socket = await connectUser();

            socket.emit('allMessages')
            socket.on('allMessages', (allMessages) => {
                setMessages(allMessages);
            });


            socket.on('newMessage', (message) => {
                setMessages((prevMessage: any) => [...prevMessage, message]);
            });
        });

        const unsubscribe = navigation.addListener("blur", () => {
            if (socket != undefined) socket.close();
        });

        return subscribe;
    }, []);

    const sendMessage = () => {
        if (socket != undefined) {
            const newMessage = {
                'message': text,
                'senderImage': profileImage,
                'user': userEmail
            };

            socket.emit('newMessage', newMessage);
            setText('');
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/ChatBackground.jpg')} resizeMode="cover"
                style={{
                    flex: 1,
                    justifyContent: 'center',
                }} >
                <FlatList
                    data={messages}
                    renderItem={({ item }) => (
                        <View style={userEmail === item.sender ? styles.mmessageWrapper : [styles.mmessageWrapper, { alignItems: 'flex-end' }]}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Image source={{ uri: item.senderImage }} style={styles.mvatar} />
                                <View style={{ flexDirection: 'column' }}>
                                    <View style={userEmail === item.sender ? styles.mmessage : [styles.mmessage, { backgroundColor: Colors.primary }]}>
                                        <Text style={userEmail === item.sender ? styles.userName : [styles.userName, { color: Colors.pink }]} >{item.sender}</Text>

                                        <Text style={styles.messageText} >{item.message}</Text>
                                        <Text style={styles.messageDate}>{item.time.substr(8, 2)}-{item.time.substr(5, 2)}-{item.time.substr(0, 4)} {item.time.substr(11, 5)}</Text>
                                        {/* <Text style={{ marginLeft: 20 }}>{item.time.substr(11, 5)}</Text> */}
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                    keyExtractor={item => item._id}
                    style={styles.messages}
                />
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your message"
                        placeholderTextColor={Colors.text}
                        value={text}
                        onChangeText={setText}
                    />
                    <TouchableOpacity style={styles.button} onPress={sendMessage}>
                        <Text style={styles.buttonText}>Send</Text>
                    </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    messages: {
        flex: 1,
    },
    messageContainer: {
        padding: 10,
    },
    username: {
        fontWeight: 'bold',
        marginBottom: 5,
        backgroundColor: "green"

    },
    messageText: {
        marginTop: 5,
        color: Colors.text
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom:10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 20,
        marginRight: 10,
        color:Colors.text
    },
    button: {
        padding: 10,
        backgroundColor: '#34B7F1',
        borderRadius: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    profileImage: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 25,
    },
    mmessageWrapper: {
        width: "100%",
        alignItems: "flex-start",
        marginBottom: 15,
    },
    mmessage: {
        maxWidth: "100%",
        backgroundColor: Colors.chat,
        padding: 15,
        borderRadius: 10,
        margin: 2,
    },
    mvatar: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 25,
    },
    userName: {
        margin: 5,
        ...StyleSheet.absoluteFillObject,
        fontSize: 10,
        color: Colors.text,
        fontWeight:'bold'
    },
    messageDate: {
        fontSize: 10,
        marginTop: 3,
        color: Colors.text,
        opacity:0.7,
    }
});

export default Chat;