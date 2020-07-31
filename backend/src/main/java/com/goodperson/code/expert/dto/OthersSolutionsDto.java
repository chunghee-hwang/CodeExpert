package com.goodperson.code.expert.dto;

import java.util.List;

import lombok.Data;

@Data
public class OthersSolutionsDto {
    private Integer maxPageNumber;
    private ProblemDto problem;
    private List<SolutionDto> solutions;
}