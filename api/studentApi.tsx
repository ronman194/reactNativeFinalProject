import apiClient from "./clientApi";

const getAllStudents = async () => {
  return apiClient.get("/student");
};

const addStudent = async (studentJson: any) => {
  return apiClient.post("/student", studentJson);
};

const uploadImage = async (image: any) => {
  return apiClient.post("/file/file", image);
};

export default {
  getAllStudents,
  addStudent,
  uploadImage
};