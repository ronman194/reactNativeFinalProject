import apiClient from "./clientApi";
import { User, loginUser, UpdateUser } from "../models/UserModel";

const register = async (userJson: User) => {
  return apiClient.post("/auth/register", userJson);
};

const login = async (userJson: loginUser) => {
  return apiClient.post("/auth/login", userJson);
};

const updateProfile = async (userJson: UpdateUser, accessToken: string) => {
  apiClient.setHeaders({ 'Authorization': 'JWT ' + accessToken })
  return apiClient.put("/auth/update", userJson);
};

const logout = async (accessToken: string) => {
  apiClient.setHeaders({ 'Authorization': 'JWT ' + accessToken })
  return apiClient.get("/auth/logout");
};



export default {
  register,
  login,
  updateProfile
  ,logout
};