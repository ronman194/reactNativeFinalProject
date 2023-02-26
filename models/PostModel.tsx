import postApi from "../api/postApi";

export type Post = {
    message: String,
    sender: String,
    image: String,
    firstName: String,
    lastName: String,
    profileImage: String,
}

export type UpdatePost = {
    message: String,
    updateImage: String,
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
        return res;
    } catch (err) {
        console.log("Fail to add a new post " + err);
    }
}

const getAllPosts = async (accessToken: string) => {
    const res: any = await postApi.getListPost(accessToken)
    let data: any = []
    if (res.data) {
        res.data.post.forEach((obj: any) => {
            data.push(obj)
        });
    }
    return data;
}

const getAllPostsBySender = async (sender: string, accessToken: string) => {
    const res: any = await postApi.getPostsBySender(sender, accessToken)
    let data: any = []
    if (res.data) {
        res.data.post.forEach((obj: any) => {
            data.push(obj)
        });
    }
    return data;
}

const getPostById = async (id: string, accessToken: string) => {
    const res: any = await postApi.getPostsById(id.toString(), accessToken)
    return res.data;
}

const deletePostById = async (id: string, accessToken: string) => {
    const res: any = await postApi.deletePostsById(id.toString(), accessToken)
    return res.data;
}

const updatePost = async (id: string, accessToken: string, updatePost: UpdatePost) => {
    const res: any = await postApi.updatePost(id.toString(), accessToken, updatePost)
    return res.data;
}

export default { addPost, getAllPosts, getAllPostsBySender, getPostById, updatePost,deletePostById }