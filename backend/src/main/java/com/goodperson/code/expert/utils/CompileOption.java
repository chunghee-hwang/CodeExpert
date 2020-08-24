package com.goodperson.code.expert.utils;

import java.io.File;
import java.util.List;

import com.goodperson.code.expert.model.Language;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompileOption {

    private int timeLimitInMilliseconds;
    private int memoryLimitInMegaBytes;
    private List<String> parameters;
    private String answer;
    private File compileFile;
    private String code;
    private Language language;
}