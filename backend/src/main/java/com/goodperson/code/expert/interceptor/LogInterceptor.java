package com.goodperson.code.expert.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.ModelAndView;
@Slf4j
public class LogInterceptor extends HandlerInterceptorAdapter {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        if(handler!=null){
            log.info("{} Start - user ip: {}", handler.toString(), request.getRemoteAddr());
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
            ModelAndView modelAndView) throws Exception {
        if(handler!=null){
            log.info("{} End - user ip: {}", handler.toString(), request.getRemoteAddr());
        }
    }
}