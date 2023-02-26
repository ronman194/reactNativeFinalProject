import apiClient from "./clientApi";
import { UpdatePost, Post } from "../models/PostModel";

const addPost = async (post: Post, accessToken: string) => {
    apiClient.setHeaders({ 'Authorization': 'JWT ' + accessToken })
    return apiClient.post("/post", post);
};
const getListPost = async (accessToken: string) => {
    apiClient.setHeaders({ 'Authorization': 'JWT ' + accessToken })
    return apiClient.get("/post");
};

const getPostsBySender = async (sender: string, accessToken: string) => {
    apiClient.setHeaders({ 'Authorization': 'JWT ' + accessToken })
    return apiClient.get("/post?sender=" + sender);
};

const getPostsById = async (id: string, accessToken: string) => {
    apiClient.setHeaders({ 'Authorization': 'JWT ' + accessToken })
    return apiClient.get("/post/" + id.split('"').join(""));
};
const deletePostsById = async (id: string, accessToken: string) => {
    apiClient.setHeaders({ 'Authorization': 'JWT ' + accessToken })
    return apiClient.delete("/post/" + id.split('"').join(""));
};

const updatePost = async (id: string, accessToken: string, updatePost: UpdatePost) => {
    apiClient.setHeaders({ 'Authorization': 'JWT ' + accessToken })
    return apiClient.put("/post/" + id.split('"').join(""), updatePost);
};


export default {
    addPost,
    getListPost,
    getPostsBySender,
    getPostsById,
    updatePost,
    deletePostsById
};