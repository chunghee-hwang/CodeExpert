package com.goodperson.code.expert.dto;

import lombok.Data;
@Data
public class UserRequestDto {
    private Long id;
    private String email;
    private String nickname;
    private String newNickname;
    private String password;
    private String passwordCheck;
    private String newPassword;
    private String newPasswordCheck;
}
