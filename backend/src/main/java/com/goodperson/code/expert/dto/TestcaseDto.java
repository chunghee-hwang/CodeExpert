package com.goodperson.code.expert.dto;

import java.util.List;

import lombok.Data;

@Data
public class TestcaseDto {
    private List<String> params;
    private String returns;
}
