package com.goodperson.code.expert.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class InputOutputTableDto implements Serializable {
    private static final long serialVersionUID = 1001L;

    private List<ParameterDto> params;

    private ReturnDto returns;

    private List<TestcaseDto> testcases;

}
