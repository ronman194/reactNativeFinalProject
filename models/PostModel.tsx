import postApi from "../api/postApi";

export type Post = {
    message: String,
    sender: String,
    image: String,
}

const addPost = async (post: Post, accessToken: string) => {
    const data: Post = {
        message: post.message,
        sender: post.sender,
        image: post.image
    }

    try {
        const res = await postApi.addPost(data, accessToken);
        console.log(res.data);
        return res;
    } catch (err) {
        console.log("Fail to add a new post " + err);
    }
}

export default { addPost }