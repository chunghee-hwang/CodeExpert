package com.goodperson.code.expert;

import java.io.Serializable;

import lombok.Data;

@Data
public class LanguageDto implements Serializable {
    private static final long serialVersionUID = -863316563636508544L;
    private Long id;
    private String name;
}
