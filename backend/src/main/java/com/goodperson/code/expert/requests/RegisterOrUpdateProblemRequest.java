package com.goodperson.code.expert.requests;

import java.io.Serializable;

import lombok.Data;

@Data
public class RegisterOrUpdateProblemRequest implements Serializable {

    private static final long serialVersionUID = 1000L;

    private Long problemId;

    private String problemTitle;

    private Long problemTypeId;

    private String problemContent;

    private String limitExplain;

    private Integer timeLimit;

    private Integer memoryLimit;

    private Long problemLevelId;

    private InputOutputTableRequest answerTable;

    private InputOutputTableRequest exampleTable;

}