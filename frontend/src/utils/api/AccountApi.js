// import axios from 'axios';
export const changeNickname = new_nickname => {
    // return axios.put('/change_nickname', { new_nickname });

    if (unescape(new_nickname) !== 'hwang') {
        throw new Error('닉네임이 유효하지 않습니다. 다른 닉네임을 써주세요!');
    }

    return {
        new_nickname
    }
}