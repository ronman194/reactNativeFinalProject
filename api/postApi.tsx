import apiClient from "./clientApi";
import { Post } from "../models/PostModel";

const addPost = async (post: Post, accessToken: string) => {
    apiClient.setHeaders({ 'Authorization': 'JWT ' + accessToken })
    return apiClient.post("/post", post);
};
const getListPost = async (accessToken: string) => {
    apiClient.setHeaders({ 'Authorization': 'JWT ' + accessToken })
    return apiClient.get("/post");
};


export default {
    addPost,
    getListPost
};