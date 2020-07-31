package com.goodperson.code.expert.controller;

import java.util.HashMap;
import java.util.Map;

import com.goodperson.code.expert.dto.RegisterOrUpdateProblemRequestDto;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class ProblemController {
    @PostMapping("/register_problem")
    public ResponseEntity<?> makeProblem(
            @RequestBody RegisterOrUpdateProblemRequestDto registerOrUpdateProblemRequestDto) {
        Map<String, Object> result = new HashMap<>();
        result.put("regiser_success", true);
        // result.put("error_message", "오류");
        return new ResponseEntity<>(registerOrUpdateProblemRequestDto, HttpStatus.OK);

    }

    @PostMapping("/upload_problem_image")
    public ResponseEntity<?> uploadProblemImage(@RequestParam("problem_id") Long problemId,
            @RequestParam("files[]") MultipartFile[] files) {
        return new ResponseEntity<>(HttpStatus.OK);
    }
}