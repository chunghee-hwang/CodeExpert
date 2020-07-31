package com.goodperson.code.expert.dto;

import lombok.Data;

@Data
public class ProblemDto {
    private Long id;
    private String title;
    private ProblemTypeDto type;
    private ProblemLevelDto level;
    private Long resolveCount;
    private Boolean createdByMe;
    private Boolean resolved;
}