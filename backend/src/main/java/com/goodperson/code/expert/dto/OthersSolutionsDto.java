package com.goodperson.code.expert.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class OthersSolutionsDto implements Serializable {

    private static final long serialVersionUID = 6060021517391498570L;
    private Integer maxPageNumber;
    private ProblemDto problem;
    private List<SolutionDto> solutions;
}