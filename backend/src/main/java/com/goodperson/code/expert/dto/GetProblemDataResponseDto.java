package com.goodperson.code.expert.dto;

import java.io.Serializable;

import lombok.Data;

@Data
public class GetProblemDataResponseDto implements Serializable {

    private static final long serialVersionUID = 1008L;

    private Long id;

    private String title;

    private ProblemTypeDto type;

    private String explain;

    private String limitExplain;

    private Integer timeLimit;

    private Integer memoryLimit;

    private ProblemLevelDto level;

    private InputOutputTableDto answerTable;

    private InputOutputTableDto exampleTable;

    private UserDto creator;
}