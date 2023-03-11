import React, { useState, useEffect, FC } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import PostModel from '../models/PostModel';
import Post from '../Components/Post';
import Colors from '../tools/Colors';
import Loading from '../Components/Loading';

const Feed: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [posts, setPosts] = useState<Array<any>>([]);
    const userAccessToken = useSelector((state: any) => state.accessToken);
    const [loading, setLoadinge] = useState(false);


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            setLoadinge(true);
            try {
                const postsList = await PostModel.getAllPosts(userAccessToken);
                setPosts(postsList.reverse());
                setLoadinge(false);
            } catch (err) {
                console.log("fail fetching students " + err);
                setLoadinge(false);
            }
        })
        setLoadinge(false);
        return unsubscribe;
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            {loading ? <Loading /> :
                <View style={styles.container}>
                    <FlatList
                        data={posts}
                        renderItem={({ item }) => <Post post={item} navigation={navigation} />}
                        keyExtractor={item => item._id.toString()}
                    />
                </View>
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 10,

    },
    postContainer: {
        backgroundColor: Colors.primary,
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 15,
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
    editPostButton: {
        fontWeight: 'bold',
        alignSelf: 'flex-end',
        marginLeft: 120
    }
});

export default Feed;
