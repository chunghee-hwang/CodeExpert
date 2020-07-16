package com.goodperson.code.expert.requests;

import java.io.Serializable;

import com.goodperson.code.expert.model.DataType;

import lombok.Data;

@Data
public class ParameterRequest implements Serializable {

    private static final long serialVersionUID = 1003L;

    private DataType dataType;

    private String name;

}