package com.goodperson.code.expert.utils;

import java.io.File;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompileOption {

    private int timeOutInMilliseconds;
    private List<String> parameters;
    private String answer;
    private File compileFile;
    private String code;
}