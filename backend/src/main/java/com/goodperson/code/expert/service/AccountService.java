package com.goodperson.code.expert.service;

import com.goodperson.code.expert.dto.UserRequestDto;
import com.goodperson.code.expert.dto.UserResponseDto;
import com.goodperson.code.expert.model.User;

import org.springframework.security.core.userdetails.UserDetailsService;

public interface AccountService extends UserDetailsService{
    UserResponseDto signUp(UserRequestDto userRequestDto) throws Exception;

    UserResponseDto changeNickname(UserRequestDto userRequestDto) throws Exception;

    UserResponseDto changePassword(UserRequestDto userRequestDto)
            throws Exception;

    void deleteAccount() throws Exception;

    User getAuthenticatedUser() throws Exception;

    UserResponseDto convertUserToResponseDto(User user);
}