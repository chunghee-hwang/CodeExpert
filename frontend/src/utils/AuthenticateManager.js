// Service handling all details related to JWT and Basic Authentication.
import axios from 'axios';
import { showErrorAlert } from './AlertManager';
import { paths } from 'constants/Paths';
import { getErrorMessageFromResponse } from './ErrorHandler';

/**로컬 스토리지에 저장될 사용자 정보 키 */
export const LOCAL_STORAGE_USER_INFO = 'user'; // 사용자 정보
export const LOCAL_STORAGE_USER_INFO_TIMESTAMP = 'userInfoTimestamp'; // 사용자 정보가 저장된 시각
export const LOCAL_STORAGE_USER_INFO_VALID_TIME = 3600000; // 사용자 정보 유효 시간(단위: ms)
class AuthenticateManager {
    executeJwtAuthenticationService(username, password) {
        return axios.post('/authenticate',
            { username, password }
        );
    }

    registerSuccessfulLoginForJwt() {
        this.setupAxiosInterceptors();
    }

    // sets up the axios interceptor to add the authorization token on every subsequent REST API call. config.headers.authorization = token
    setupAxiosInterceptors() {
        axios.interceptors.request.use(
            config => {
                // 요청마다 쿠키에 저장된 토큰을 서버에 전송
                config.withCredentials = true;
                return config;
            }
        )
    }

    isUserLoggedIn() {
        let user = localStorage.getItem(LOCAL_STORAGE_USER_INFO);
        if (user === null) return false;
        return true;
    }

    // 사용자 정보 유효기간 갱신
    invalidateUserInfoTimestamp = () => {
        localStorage.setItem(LOCAL_STORAGE_USER_INFO_TIMESTAMP, String(new Date().getTime()));
    }

    // 사용자 정보 저장
    saveUserDataToLocalStorage = user => {
        localStorage.setItem(LOCAL_STORAGE_USER_INFO, JSON.stringify(user));
        this.invalidateUserInfoTimestamp();
    }

    // 사용자 정보 제거
    removeUserDataFromLocalStorage = () => {
        localStorage.removeItem(LOCAL_STORAGE_USER_INFO);
    }

    // 서버에서 unauthrized나 method not allowed 에러가 발생하면 
    // 사용자 정보 로컬 스토리지에서 지우고 로그인페이지로 이동
    catchAxiosUnAuthorizedError = (axiosError)=>{
        if(axiosError.response && axiosError.response.status){
            // not authorized
            if(axiosError.response.status === 401 || axiosError.response.status === 405){
                showErrorAlert({text:'세션이 만료되었습니다. 다시 로그인해 주세요.'}).then(()=>{
                    this.removeUserDataFromLocalStorage();
                    window.location.href = paths.pages.loginForm;
                });
            }else{
                throw new Error(getErrorMessageFromResponse(axiosError));
            }
        }
    }

    // 사용자 정보 가져오기
    getUserDataFromLocalStorage = () => {
        let userInfo = localStorage.getItem(LOCAL_STORAGE_USER_INFO);
        if (userInfo) {
            let userInfoTimestamp = localStorage.getItem(LOCAL_STORAGE_USER_INFO_TIMESTAMP);
            if (userInfoTimestamp) {
                // 유효기간 체크
                if (new Date().getTime() - Number(userInfoTimestamp) > LOCAL_STORAGE_USER_INFO_VALID_TIME) {
                    userInfo = null;
                    this.removeUserDataFromLocalStorage();
                } else {
                    this.invalidateUserInfoTimestamp();
                }
            }
        }
        return userInfo;
    }
}

export default new AuthenticateManager();