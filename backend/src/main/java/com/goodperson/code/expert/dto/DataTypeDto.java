package com.goodperson.code.expert.dto;

import java.io.Serializable;

import lombok.Data;

@Data
public class DataTypeDto implements Serializable {
    private static final long serialVersionUID = 1006L;
    private Long id;
    private String name;
}