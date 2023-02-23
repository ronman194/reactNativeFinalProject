// import { FC, useState, useEffect } from 'react';
// import { StatusBar, StyleSheet, Text, View, Image, TouchableOpacity, Button, Alert, TextInput, FlatList, TouchableHighlight } from 'react-native';

// import StudentModel, { Student } from '../models/StudentModel';

// const ListItem: FC<{ name: String, id: String, image: String, onRowSelected: (id: String) => void }> =
//     ({ name, id, image, onRowSelected }) => {
//         const onClick = () => {
//             console.log('int he row: row was selected ' + id)
//             onRowSelected(id)
//         }
//         return (
//             <TouchableHighlight onPress={onClick} underlayColor={'gainsboro'}>
//                 <View style={styles.listRow}>
//                     {image == "" && <Image style={styles.listRowImage} source={require('../assets/ava.png')} />}
//                     {image != "" && <Image style={styles.listRowImage} source={{ uri: image.toString() }} />}
//                     <View style={styles.listRowTextContainer}>
//                         <Text style={styles.listRowName}>{name}</Text>
//                         <Text style={styles.listRowId}>{id}</Text>
//                     </View>
//                 </View>
//             </TouchableHighlight>
//         )
//     }


// const StudentList: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
//     const onRowSelected = (id: String) => {
//         console.log("in the list: row was selected " + id)
//         navigation.navigate('StudentDetails', { studentId: id })
//     }

//     const [students, setStudents] = useState<Array<Student>>();

//     useEffect(() => {
//         const unsubscribe = navigation.addListener('focus', async () => {
//             console.log('focus')
//             let students: Student[] = []
//             try {
//                 students = await StudentModel.getAllStudents();
//                 console.log("fetching students complete");
//             } catch (err) {
//                 console.log("fail fetching students " + err);
//             }
//             console.log("fetching finish");
//             setStudents(students);
//         })
//         return unsubscribe;
//     })
//     return (
//         <FlatList style={styles.flatlist}
//             data={students}
//             keyExtractor={student => student.id.toString()}
//             renderItem={({ item }) => (
//                 <ListItem name={item.name} id={item.id} image={item.image} onRowSelected={onRowSelected} />
//             )}
//         >
//         </FlatList>
//     );
// };


// const styles = StyleSheet.create({
//     container: {
//         marginTop: StatusBar.currentHeight,
//         flex: 1,
//         backgroundColor: 'grey',
//     },
//     flatlist: {
//         flex: 1,
//     },
//     listRow: {
//         margin: 4,
//         flexDirection: "row",
//         height: 150,
//         elevation: 1,
//         borderRadius: 2,
//     },
//     listRowImage: {
//         margin: 10,
//         resizeMode: "contain",
//         height: 130,
//         width: 130,
//     },
//     listRowTextContainer: {
//         flex: 1,
//         margin: 10,
//         justifyContent: "space-around"
//     },
//     listRowName: {
//         fontSize: 30
//     },
//     listRowId: {
//         fontSize: 25
//     }


// });

// export default StudentList

import React, { useState, useEffect, FC } from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import PostModel, { PostDetails } from '../models/PostModel';

const Post: FC<{ post: any }> =
    ({ post }) => {
        return (
            <View style={styles.postContainer}>
                <View style={styles.header}>
                    <Image style={styles.avatar} source={{ uri: post.senderProfileImage }} />
                    <Text style={styles.username}>{post.senderFirstName} {post.senderLastName}</Text>
                </View>
                {post.postImage && <Image style={styles.postImage} source={{ uri: post.postImage }} />}
                <Text style={styles.caption}>{post.message}</Text>
            </View>
        );
    };

const Feed: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [posts, setPosts] = useState([]);
    const userAccessToken = useSelector((state: any) => state.accessToken);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            console.log('focus')
            try {
                const postsList = await PostModel.getAllPosts(userAccessToken);
                setPosts(postsList)
                console.log("fetching students complete");
            } catch (err) {
                console.log("fail fetching students " + err);
            }
            console.log("fetching finish");
            console.log("Posts :")
            console.log(posts)
        })
        return unsubscribe;
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <FlatList
                    data={posts}
                    renderItem={({ item }) => <Post post={item} />}
                    keyExtractor={item => item._id.toString()}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 10,
    },
    postContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal:15,
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    username: {
        fontWeight: 'bold',
    },
    postImage: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    caption: {
        fontSize: 16,
    },
});

export default Feed;
