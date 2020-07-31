package com.goodperson.code.expert.service;

import com.goodperson.code.expert.dto.UserDto;
import com.goodperson.code.expert.model.User;

public interface AccountService {
    UserDto login(String email, String password) throws Exception;

    UserDto signUp(String email, String nickname, String password, String passwordCheck) throws Exception;

    UserDto changeNickname(User authenticatedUser, String newNickname) throws Exception;

    UserDto changePassword(User authenticatedUser, String password, String newPassword, String newPasswordCheck)
            throws Exception;

    void deleteAccount(User authenticatedUser) throws Exception;

}