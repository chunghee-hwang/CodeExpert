package com.goodperson.code.expert.utils.validation;

import java.net.URLDecoder;

import com.goodperson.code.expert.dto.UserRequestDto;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

@Component
public class AccountValidation {
    private final String emailRegex = "^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$";
    private final String passwordRegex = "^.*(?=^.{8,30}$)(?=.*\\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$"; //특수문자 / 문자 / 숫자 포함 형태의 8~30자리 이내의 암호 정규식
    private final String nicknameRegex = "^[a-zA-Z가-힣0-9]{2,15}$";

    public void validateSignUp(UserRequestDto userDto) throws Exception {
        final String password = userDto.getPassword();
        final String passwordCheck = userDto.getPasswordCheck();
        final String email = userDto.getEmail();
        final String nickname = userDto.getNickname();
        if(StringUtils.isBlank(password)||
        StringUtils.isBlank(passwordCheck)||
        StringUtils.isBlank(email) || 
        StringUtils.isBlank(nickname)){
            throw new Exception("The required fields are empty.");
        }
        if(!URLDecoder.decode(nickname, "UTF-8").matches(nicknameRegex)){
            throw new Exception("The nickname format is not valid.");
        }
        if(!email.matches(emailRegex)){
            throw new Exception("The email format is not valid.");
        }
        if(!password.matches(passwordRegex)){
            throw new Exception("The password format is not valid.");
        }
        // 비밀번호 비밀번호 확인 일치 체크
        if (!password.equals(passwordCheck)) {
            throw new Exception("The password and password check are not same.");
        }
    }

    public void validateChangeNickname(UserRequestDto userDto) throws Exception {
        final String newNickname = userDto.getNewNickname();
        if(StringUtils.isBlank(newNickname)){
            throw new Exception("The required fields are empty.");
        }
        if(!newNickname.matches(nicknameRegex)){
            throw new Exception("The nickname format is not valid.");
        }
    }

    public void validateChangePassword(UserRequestDto userDto) throws Exception {
        final String password = userDto.getPassword();
        final String newPassword = userDto.getNewPassword();
        final String newPasswordCheck = userDto.getNewPasswordCheck();
        if(StringUtils.isBlank(password)||
        StringUtils.isBlank(newPassword)||
        StringUtils.isBlank(newPasswordCheck)){
            throw new Exception("The required fields are empty.");
        }
        if(!newPassword.matches(passwordRegex)){
            throw new Exception("The password format is not valid.");
        }
        if(!newPassword.equals(newPasswordCheck)){
            throw new Exception("The password and passwordCheck are not equivalent.");
        }
    }
}

