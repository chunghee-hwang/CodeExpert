import AuthenticateManager from "utils/AuthenticateManager";
import axios from "axios";

export const changeNickname = (data) => {
    return axios.put("/changeNickname", data);
}

export const changePassword = (data) => {
    return axios.put("/changePassword", data);
}

export const deleteAccount = () => {
    return axios.put("/deleteAccount");
}

export const login = ({ email, password }) => {
    return AuthenticateManager.executeJwtAuthenticationService(email, password)
    .then((resposne)=>{
        AuthenticateManager.registerSuccessfulLoginForJwt(email);
        return resposne;
    });
    // return {
    //     user: {
    //         email: 1,
    //         nickname: 'hwang',
    //         resolvedProblemCount: 432
    //     }
    // }
}

export const logout = () => {
    return axios.post("/logoutAccount");
}

export const signUp = (data) => {
    return axios.post("/signup", data);
}