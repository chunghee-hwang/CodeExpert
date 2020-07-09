// import axios from 'axios';
export const changeNickname = ({ nickname }) => {
    // return axios.put('/change_nickname', { new_nickname });

    return {
        nickname
    }
}

export const changePassword = ({ password, new_password, new_password_check }) => {
    return {
        change_success: true
    };
}

export const deleteAccount = () => {
    return {
        delete_success: true
    };
}

export const login = ({ id, password }) => {
    return {
        user: {
            id: 1,
            nickname: 'hwang',
            resolved_problem_count: 432
        }
    }
}

export const logout = () => {
    return {
        logout_success: true
    }
}

export const signUp = ({ id, nickname, password, password_check }) => {
    return {
        signup_success: true
    }
}