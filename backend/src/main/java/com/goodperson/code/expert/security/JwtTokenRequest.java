package com.goodperson.code.expert.security;

import lombok.Data;

@Data
public class JwtTokenRequest {
    private String username;
    private String password;
}