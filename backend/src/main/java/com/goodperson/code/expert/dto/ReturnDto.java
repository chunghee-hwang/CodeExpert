package com.goodperson.code.expert.dto;

import java.io.Serializable;

import lombok.Data;

@Data
public class ReturnDto implements Serializable {
    private static final long serialVersionUID = 1005L;

    private DataTypeDto dataType;
}
