package com.goodperson.code.expert;

import java.io.Serializable;

import lombok.Data;

@Data
public class CodeDto implements Serializable {

    private static final long serialVersionUID = 1007L;
    private String initCode; // 초기 코드
    private String prevCode; // 제출된 코드
    private LanguageDto language;
}
