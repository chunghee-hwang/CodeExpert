package com.goodperson.code.expert.requests;

import java.io.Serializable;

import com.goodperson.code.expert.model.DataType;

import lombok.Data;

@Data
public class ReturnRequest implements Serializable {
    private static final long serialVersionUID = 1005L;

    private DataType dataType;
}
