package com.goodperson.code.expert.security;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.goodperson.code.expert.utils.TokenCookieManager;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.SignatureException;

// API 요청을 할 때마다 사용자가 인증되어있는지 확인하는 필터
@Component
public class JwtTokenAuthorizationOncePerRequestFilter extends OncePerRequestFilter {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private UserDetailsService accountService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private TokenCookieManager tokenCookieManager;

    // 쿠키에서 토큰을 불러오는 방식
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        logger.debug("Authentication Request for '{}'", request.getRequestURL());
        Cookie tokenCookie = tokenCookieManager.getTokenCookie(request);
        String username = null;
        String jwtToken = null;
        if(tokenCookie !=null){
            jwtToken = tokenCookie.getValue();
        }
        if (jwtToken != null) {
            try {
                username = jwtTokenUtil.getUsernameFromToken(jwtToken);
            } catch (IllegalArgumentException e) {
                logger.error("JWT_TOKEN_UNABLE_TO_GET_USERNAME", e);
                tokenCookieManager.deleteTokenFromCookie(response);
            } catch (ExpiredJwtException e) {
                logger.warn("JWT_TOKEN_EXPIRED", e);
                tokenCookieManager.deleteTokenFromCookie(response);
            }catch(SignatureException e){
                logger.error("JWT_SIGNATURE_NOT_MATCHED");
                tokenCookieManager.deleteTokenFromCookie(response);
            }
        }
        logger.debug("JWT_TOKEN_USERNAME_VALUE '{}'", username);
        UserDetails userDetails = null;
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try{
                userDetails = this.accountService.loadUserByUsername(username);
                if (jwtTokenUtil.validateToken(jwtToken, userDetails)) {
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    usernamePasswordAuthenticationToken
                            .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                }
            }
            catch(Exception e){
                tokenCookieManager.deleteTokenFromCookie(response);
                response.sendError(400, "The token is invalid. Please refresh page.");
            }
            
        }
        filterChain.doFilter(request, response);

    }
}