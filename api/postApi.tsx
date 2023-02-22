import apiClient from "./clientApi";
import { Post } from "../models/PostModel";

const addPost = async (post: Post, accessToken: string) => {
    apiClient.setHeaders({'Authorization': 'JWT ' + accessToken})
    return apiClient.post("/post", post);
};


export default {
    addPost,
};