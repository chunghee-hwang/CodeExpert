package com.goodperson.code.expert.dto;

import java.io.Serializable;

import lombok.Data;

@Data
public class ParameterDto implements Serializable {

    private static final long serialVersionUID = 1003L;

    private DataTypeDto dataType;

    private String name;

}