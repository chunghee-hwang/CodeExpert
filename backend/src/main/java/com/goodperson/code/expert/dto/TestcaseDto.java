package com.goodperson.code.expert.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class TestcaseDto implements Serializable {

    private static final long serialVersionUID = 1006L;
    private List<String> params;
    private String returns;
}
