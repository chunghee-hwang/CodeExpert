package com.goodperson.code.expert.requests;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class InputOutputTableRequest implements Serializable {
    private static final long serialVersionUID = 1001L;

    private List<ParameterRequest> params;

    private ReturnRequest returns;

    private List<TestcaseRequest> testcases;

}
