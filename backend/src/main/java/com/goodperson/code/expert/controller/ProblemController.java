package com.goodperson.code.expert.controller;

import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

import com.goodperson.code.expert.requests.RegisterOrUpdateProblemRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class ProblemController {
    @PostMapping("/register_problem")
    public ResponseEntity<?> makeProblem(@RequestBody RegisterOrUpdateProblemRequest registerOrUpdateProblemRequest) {
        System.out.println(registerOrUpdateProblemRequest);

        Map<String, Object> result = new HashMap<>();
        result.put("regiser_success", true);
        // result.put("error_message", "오류");
        return new ResponseEntity<>(result, HttpStatus.OK);

    }
}