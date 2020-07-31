package com.goodperson.code.expert.dto;

import lombok.Data;

@Data
public class CodeDto {
    private String initCode; // 초기 코드
    private String prevCode; // 제출된 코드
    private LanguageDto language;
}
