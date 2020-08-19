import AuthenticateManager from "utils/AuthenticateManager";
import axios from "axios";

export const changeNickname = (data) => {
    return axios.put("/changeNickname", data).then((res)=>{
        return res;
    });
}

export const changePassword = (data) => {
    return axios.put("/changePassword", data);
}

export const deleteAccount = () => {
    return axios.put("/deleteAccount");
}

export const login = ({ email, password }) => {
    return AuthenticateManager.executeJwtAuthenticationService(email, password)
    .then((res)=>{
        AuthenticateManager.registerSuccessfulLoginForJwt();
        return res;
    });
}

export const logout = () => {
    return axios.post("/logoutAccount");
}

export const signUp = (data) => {
    return axios.post("/signup", data);
}