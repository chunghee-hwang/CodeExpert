package com.goodperson.code.expert.utils.validation;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.goodperson.code.expert.dto.DataTypeDto;
import com.goodperson.code.expert.dto.InputOutputTableDto;
import com.goodperson.code.expert.dto.ParameterDto;
import com.goodperson.code.expert.dto.RegisterOrUpdateProblemRequestDto;
import com.goodperson.code.expert.dto.ReturnDto;
import com.goodperson.code.expert.dto.TestcaseDto;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ProblemValidation {
    // 자료형 정규식
    private final String integerRegex = "^[+-]?\\d+$";
    private final String integerArrayRegex = "\\[([+-]?\\d+(,)?(\\s)?)*\\]$";
    private final String longRegex = "^[+-]?\\d+$";
    private final String longArrayRegex = "^\\[([+-]?\\d+(,)?(\\s)?)*\\]$";
    private final String doubleRegex = "^[+-]?\\d+(.)?(\\d+)?$";
    private final String doubleArrayRegex = "^\\[([+-]?\\d+(.)?(\\d+)?(,)?(\\s)?)*\\]$";
    private final String booleanRegex = "^(true|false)$";
    private final String booleanArrayRegex = "^\\[((true|false)(,)?(\\s)?)*\\]$";
    private final String stringRegex = "^\"[^\"]*\"$";
    private final String stringArrayRegex = "^\\[(\"[^\"]*\"(,)?(\\s)?)*\\]$";

    // 파라미터 이름 정규식 (변수명 규칙)
    private final String valueNameRegex = "^[^0-9][\\w]+$";

    private final String[] javaKeywords = { "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char",
            "class", "const", "continue", "default", "do", "double", "else", "extends", "false", "final", "finally",
            "float", "for", "goto", "if", "implements", "import", "instanceof", "int", "interface", "long", "native",
            "new", "null", "package", "private", "protected", "public", "return", "short", "static", "strictfp",
            "super", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "void",
            "volatile", "while" };

    private final String[] python3Keywords = { "False", "None", "True", "and", "as", "assert", "async", "await",
            "break", "class", "continue", "def", "del", "elif", "else", "except", "finally", "for", "from", "global",
            "if", "import", "in", "is", "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try", "while",
            "with", "yield" };

    private final String[] cppKeywords = { "asm", "else", "new", "this", "auto", "enum", "operator", "throw", "bool",
            "explicit", "private", "true", "break", "export", "protected", "try", "case", "extern", "public", "typedef",
            "catch", "false", "register", "typeid", "char", "float", "reinterpret_cast", "typename", "class", "for",
            "return", "union", "const", "friend", "short", "unsigned", "const_cast", "goto", "signed", "using",
            "continue", "if", "sizeof", "virtual", "default", "inline", "static", "void", "delete", "int",
            "static_cast", "volatile", "do", "long", "struct", "wchar_t", "double", "mutable", "switch", "while",
            "dynamic_cast", "namespace", "template", "And", "bitor", "not_eq", "xor", "and_eq", "compl", "or", "xor_eq",
            "bitand", "not", "or_eq" };

    @Value("${problem.title.length.downlimit}")
    private int problemTitleLengthDownLimit;

    @Value("${problem.limitExplain.length.downlimit}")
    private int problemLimitExplainLengthDownLimit;

    @Value("${problem.parameter.length.uplimit}")
    private int problemParameterLengthUpLimit;
    @Value("${problem.timeLimit.length.downlimit}")
    private int problemTimeLimitLengthDownLimit;
    
    @Value("${problem.parameterName.length.uplimit}")
    private int problemParameterNameLengthUpLimit;

    private boolean isWordKeyword(String[] keywords, String word) {
        return Arrays.asList(keywords).indexOf(word) != -1;
    }

    // 예약어인지 판단하는 메소드 (모든 언어의 키워드를 검사)
    private boolean isKeyword(String word) {
        return isWordKeyword(cppKeywords, word) || isWordKeyword(javaKeywords, word)
                || isWordKeyword(python3Keywords, word);
    }

    public void validateRegisterOrUpdateProblem(RegisterOrUpdateProblemRequestDto request) throws Exception {
        final String problemTitle = request.getProblemTitle();
        final String problemContent = request.getProblemContent();
        final String limitExplain = request.getLimitExplain();
        final Integer timeLimit = request.getTimeLimit();
        final InputOutputTableDto answerTable = request.getAnswerTable();
        final InputOutputTableDto exampleTable = request.getExampleTable();
        Objects.requireNonNull(timeLimit);
        Objects.requireNonNull(answerTable);
        Objects.requireNonNull(exampleTable);
        if (StringUtils.isBlank(problemTitle) || StringUtils.isBlank(problemContent)
                || StringUtils.isBlank(limitExplain)) {
            throw new Exception("The required fields are empty.");
        }
        if (problemTitle.length() > problemTitleLengthDownLimit) {
            throw new Exception("The problem title length must <="+problemTitleLengthDownLimit);
        }
        if (limitExplain.length() > problemLimitExplainLengthDownLimit) {
            throw new Exception("The limit explain length must <="+problemLimitExplainLengthDownLimit);
        }
        if (String.valueOf(timeLimit).length() > problemTimeLimitLengthDownLimit) {
            throw new Exception("The time limit length must <="+problemTimeLimitLengthDownLimit);
        }
        if (!(String.valueOf(timeLimit).matches("^\\d+$") && timeLimit > 0)) {
            throw new Exception("The time limit must > 0");
        }
        validateInputOutputTable(exampleTable);
        validateInputOutputTable(answerTable);
    }

    private boolean isValueDataTypeMatch(String dataTypeName, String value) {
        boolean isMatch = false;
        switch (dataTypeName) {
            case "integer":
                isMatch = value.matches(integerRegex);
                break;
            case "integerArray":
                isMatch = value.matches(integerArrayRegex);
                break;
            case "long":
                isMatch = value.matches(longRegex);
                break;
            case "longArray":
                isMatch = value.matches(longArrayRegex);
                break;
            case "double":
                isMatch = value.matches(doubleRegex);
                break;
            case "doubleArray":
                isMatch = value.matches(doubleArrayRegex);
                break;
            case "boolean":
                isMatch = value.matches(booleanRegex);
                break;
            case "booleanArray":
                isMatch = value.matches(booleanArrayRegex);
                break;
            case "string":
                isMatch = value.matches(stringRegex);
                break;
            case "stringArray":
                isMatch = value.matches(stringArrayRegex);
                break;
        }
        return isMatch;
    }

    private boolean allInputValuesDataTypeMatch(List<String> values, List<ParameterDto> params) {
        final int paramsSize = params.size();
        for (int i = 0; i < paramsSize; i++) {
            String dataTypeName = params.get(i).getDataType().getName();
            String value = values.get(i);
            if (!isValueDataTypeMatch(dataTypeName, value)) {
                return false;
            }
        }
        return true;
    }

    private void validateInputOutputTable(InputOutputTableDto inputOutputTable) throws Exception {
        final List<ParameterDto> params = inputOutputTable.getParams();
        final ReturnDto returns = inputOutputTable.getReturns();
        final List<TestcaseDto> testcases = inputOutputTable.getTestcases();
        final DataTypeDto returnsDataType = returns.getDataType();
        Objects.requireNonNull(params);
        Objects.requireNonNull(returns);
        Objects.requireNonNull(testcases);
        Objects.requireNonNull(returnsDataType);
        Objects.requireNonNull(returnsDataType.getId());

        final List<String> paramNames = params.stream().map(param -> param.getName()).collect(Collectors.toList());
        if (params.stream().count() < problemParameterLengthUpLimit) {
            throw new Exception("The parameter length must >= "+problemParameterLengthUpLimit);
        }
        if (paramNames.stream().anyMatch(paramName -> paramName.length() < problemParameterNameLengthUpLimit)) {
            throw new Exception("The parameter name length must >= "+problemParameterNameLengthUpLimit);
        }
        if (params.stream().anyMatch(param -> param.getDataType() == null || param.getDataType().getId() == null)) {
            throw new Exception("The parameter data type is empty.");
        }
        if (!testcases.stream().allMatch(testcase -> testcase.getParams().stream()
                .allMatch(param -> param != null && testcase.getReturns() != null))) {
            throw new Exception("The input value or return value is empty.");
        }
        if (paramNames.size() != paramNames.stream().distinct().count()) {
            throw new Exception("The parameter name must be unique");
        }
        if (paramNames.stream().anyMatch(paramName -> !paramName.matches(valueNameRegex) || isKeyword(paramName))) {
            throw new Exception("The parameter name format is not valid");
        }
        if (!testcases.stream().allMatch(testcase -> allInputValuesDataTypeMatch(testcase.getParams(), params))) {
            throw new Exception("The input value's data type format is not valid");
        }
        if (!testcases.stream()
                .allMatch(testcase -> isValueDataTypeMatch(returns.getDataType().getName(), testcase.getReturns()))) {
            throw new Exception("The return value's data type format is not valid");
        }

    }
}