package com.goodperson.code.expert.dto;

import java.io.Serializable;

import lombok.Data;

@Data
public class RegisterOrUpdateProblemRequestDto implements Serializable {

    private static final long serialVersionUID = 1000L;

    private Long problemId;

    private String problemTitle;

    private Long problemTypeId;

    private String problemContent;

    private String limitExplain;

    private Integer timeLimit;

    private Integer memoryLimit;

    private Long problemLevelId;

    private InputOutputTableDto answerTable;

    private InputOutputTableDto exampleTable;
}