package com.goodperson.code.expert.utils;

import java.util.Collections;
import java.util.Map;

import org.springframework.stereotype.Component;
@Component
public class ErrorResponseManager {
    public Map<String, String> makeErrorResponse(Exception e){
        return Collections.singletonMap("errorMessage", e.getMessage());
    }
}