package com.goodperson.code.expert.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class TokenCookieManager {
    @Value("${token.cookie.name}")
    private String tokenCookieName;

    @Value("${token.cookie.expiration.in.seconds}")
    private int tokenCookieExpirationTime;
    
    public void addTokenToCookie(HttpServletResponse response, String token) {
        Cookie tokenCookie = new Cookie(tokenCookieName, token);
        tokenCookie.setMaxAge(tokenCookieExpirationTime);
        tokenCookie.setPath("/");
        response.addCookie(tokenCookie);
    }
    public void deleteTokenFromCookie(HttpServletResponse response) {
        Cookie tokenCookie = new Cookie(tokenCookieName, null);
        tokenCookie.setMaxAge(0);
        tokenCookie.setPath("/");
        response.addCookie(tokenCookie);
    }

    public Cookie getTokenCookie(HttpServletRequest request){
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(tokenCookieName)) {
                    return cookie;
                }
            }
        }
        return null;
    }
}