import userApi from "../api/userApi";

export type User = {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    profileImage: String
}
export type UpdateUser = {
    firstName: String,
    lastName: String,
    email: String,
    profileImage: String
}

export type loginUser = {
    email: String,
    password: String
}

const registerUser = async (user: User) => {
    const data: User = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        profileImage: user.profileImage
    }

    try {
        const res = await userApi.register(data);
        console.log(res.data);
        return res;
    } catch (err) {
        console.log("Fail to add a student " + err);
    }
}

const loginUser = async (user: loginUser) => {
    const data: loginUser = {
        email: user.email,
        password: user.password
    }

    try {
        const res = await userApi.login(data);
        console.log(res.data);
        return res;
    } catch (err) {
        console.log("Fail to add a student " + err);
    }
}
const updateUser = async (user: UpdateUser, accessToken: string) => {
    try {
        const res = await userApi.updateProfile(user, accessToken);
        console.log(res.data);
        return res;
    } catch (err) {
        console.log("Fail to update a student " + err);
    }
}


export default { registerUser, loginUser, updateUser }