package com.goodperson.code.expert.dto;

import java.io.Serializable;

import lombok.Data;

@Data
public class UserDto implements Serializable {
    private static final long serialVersionUID = 2871332156668353548L;
    private Long id;
    private String nickname;
}
