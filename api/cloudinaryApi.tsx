import { Alert } from "react-native";
import { create } from 'apisauce'


// const uploadToCloudinary = async (photo: any) => {
//     const data = new FormData();
//     data.append('file', photo);
//     data.append("upload_preset", "DemoApp");
//     data.append("cloud_name", "de3v0l8gb");
//     fetch("https://api.cloudinary.com/v1_1/de3v0l8gb/image/upload", {
//         method: 'POST',
//         body: data,
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'multipart/form-data'
//         }
//     }).then(res => res.json())
//         .then(data => {
//             console.log(data);
//             return data.url;
//         }).catch(err => {
//             Alert.alert("Error While Uploading")
//         });
// }

const api = create({
    baseURL: 'https://api.cloudinary.com/v1_1/de3v0l8gb/image/upload',
    headers: { 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' },
})
const uploadToCloudinary = async (photo: any) => {
    const data = new FormData();
    data.append('file', photo);
    data.append("upload_preset", "DemoApp");
    data.append("cloud_name", "de3v0l8gb");
    return api.post('/', data);
    // uri = uri.url;
    // return uri;
};

export default uploadToCloudinary;