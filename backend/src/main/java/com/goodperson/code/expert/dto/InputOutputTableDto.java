package com.goodperson.code.expert.dto;

import java.util.List;

import lombok.Data;

@Data
public class InputOutputTableDto {
    private List<ParameterDto> params;

    private ReturnDto returns;

    private List<TestcaseDto> testcases;

}
