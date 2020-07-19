package com.goodperson.code.expert.dto;

import java.io.Serializable;

import lombok.Data;

@Data
public class LanguageDto implements Serializable {
    private static final long serialVersionUID = 4874458231034769181L;
    private Long id;
    private String name;
}
