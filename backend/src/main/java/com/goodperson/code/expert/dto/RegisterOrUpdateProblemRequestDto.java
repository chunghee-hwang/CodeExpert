package com.goodperson.code.expert.dto;

import lombok.Data;

@Data
public class RegisterOrUpdateProblemRequestDto {

    private Long problemId;

    private String problemTitle;

    private Long problemTypeId;

    private String problemContent;

    private String limitExplain;

    private Integer timeLimit;

    private Long problemLevelId;

    private InputOutputTableDto answerTable;

    private InputOutputTableDto exampleTable;
}