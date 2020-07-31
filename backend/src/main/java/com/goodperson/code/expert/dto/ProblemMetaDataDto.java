package com.goodperson.code.expert.dto;

import java.util.List;

import com.goodperson.code.expert.model.DataType;
import com.goodperson.code.expert.model.Language;
import com.goodperson.code.expert.model.ProblemLevel;
import com.goodperson.code.expert.model.ProblemType;

import lombok.Data;

@Data
public class ProblemMetaDataDto {
    List<ProblemType> problemTypes;
    List<ProblemLevel> problemLevels;
    List<DataType> dataTypes;
    List<Language> languages;
}