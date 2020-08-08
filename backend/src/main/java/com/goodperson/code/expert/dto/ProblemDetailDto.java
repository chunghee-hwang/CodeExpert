package com.goodperson.code.expert.dto;

import lombok.Data;

@Data
public class ProblemDetailDto {
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

    private UserRequestDto creator;
}