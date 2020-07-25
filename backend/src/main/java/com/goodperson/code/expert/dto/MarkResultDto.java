package com.goodperson.code.expert.dto;

import java.io.Serializable;

import lombok.Data;

@Data
public class MarkResultDto implements Serializable {
    private static final long serialVersionUID = 7996087437678280846L;

    private Boolean isTimeOut;
    private Boolean isAnswer;
    private Double timeElapsed;
    private String expected;
    private String actual;
    private String errorMessage;
    private String outputMessage;
}