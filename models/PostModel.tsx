import postApi from "../api/postApi";

export type Post = {
    message: String,
    sender: String,
    image: String,
    firstName: String,
    lastName: String,
    profileImage: String,
}

type Likes = {
    email: String,
    firstName: String,
    lastName: String
}
type Comment = {
    email: String,
    firstName: String,
    lastName: String,
    comment: String
}

export type PostDetails = {
    message: String,
    sender: String,
    image: String,
    firstName: String,
    lastName: String,
    profileImage: String,
    likes: Array<Likes>,
    comments: Array<Comment>,
    _id: number
}

const addPost = async (post: Post, accessToken: string) => {
    try {
        const res = await postApi.addPost(post, accessToken);
        console.log(res.data);
        return res;
    } catch (err) {
        console.log("Fail to add a new post " + err);
    }
}

const getAllPosts = async (accessToken: string) => {
    console.log("getAllPosts")
    const res: any = await postApi.getListPost(accessToken)
    console.log("RESSSSSSSS ")
    console.log(res);
    let data: any = []
    if (res.data) {
        res.data.post.forEach((obj: any) => {
            data.push(obj)
        });
    }
    return data;
}

const getAllPostsBySender = async (sender: string, accessToken: string) => {
    console.log("get posts by: " + sender)
    const res: any = await postApi.getPostsBySender(sender, accessToken)
    console.log("RESSSSSSSS ")
    console.log(res);
    let data: any = []
    if (res.data) {
        res.data.post.forEach((obj: any) => {
            data.push(obj)
        });
    }
    return data;
}

export default { addPost, getAllPosts, getAllPostsBySender }