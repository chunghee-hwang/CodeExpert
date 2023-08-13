package com.goodperson.code.expert.utils;

import java.util.List;

import com.goodperson.code.expert.model.Language;
import com.goodperson.code.expert.model.ProblemParameter;
import com.goodperson.code.expert.model.ProblemReturn;

import org.springframework.stereotype.Component;

@Component
public class CodeGenerateManager {

    public String makeInitCode(List<ProblemParameter> problemParameters, ProblemReturn problemReturn,
            Language language) {
        return switch (language.getName()) {
            case "java" -> makeJavaInitCode(problemParameters, problemReturn);
            case "cpp" -> makeCppInitCode(problemParameters, problemReturn);
            case "python3" -> makePythonInitCode(problemParameters, problemReturn);
            default -> "An error occurred while the code is initialized.";
        };
    }

    private String makeCppInitCode(List<ProblemParameter> problemParameters, ProblemReturn problemReturn) {
        StringBuilder stringBuilder = new StringBuilder(
                "#include <string>\n#include <vector>\n\n");
        String returnDataTypeExpression = "";
        String returnDataTypeName = problemReturn.getDataType().getName();
        returnDataTypeExpression = getCppDataTypeExpression(returnDataTypeName);
        stringBuilder.append(returnDataTypeExpression);
        stringBuilder.append("solution(");
        final int parameterCount = problemParameters.size();
        for (int idx = 0; idx < parameterCount; idx++) {
            ProblemParameter parameter = problemParameters.get(idx);
            String paramDataTypeName = parameter.getDataType().getName();
            stringBuilder.append(getCppDataTypeExpression(paramDataTypeName));
            stringBuilder.append(parameter.getName());
            if (idx != parameterCount - 1)
                stringBuilder.append(", ");
        }
        stringBuilder.append(")\n{\n\t");
        stringBuilder.append(returnDataTypeExpression);
        stringBuilder.append("answer = ");
        stringBuilder.append(getCppAnswerValueExpression(returnDataTypeName));
        stringBuilder.append(";\n\treturn answer;\n}");
        return stringBuilder.toString();
    }

    private String makePythonInitCode(List<ProblemParameter> problemParameters, ProblemReturn problemReturn) {
        StringBuilder stringBuilder = new StringBuilder("def solution(");
        final int parameterCount = problemParameters.size();
        for (int idx = 0; idx < parameterCount; idx++) {
            stringBuilder.append(problemParameters.get(idx).getName());
            if (idx != parameterCount - 1)
                stringBuilder.append(", ");
        }
        stringBuilder.append("):\n\tanswer = ");
        final String returnValueExpression;
        final String returnDataTypeName = problemReturn.getDataType().getName();
        if (returnDataTypeName.endsWith("Array")) {
            returnValueExpression = "[]";
        } else {
            returnValueExpression = switch (returnDataTypeName) {
                case "integer", "long", "double" -> "0";
                case "boolean" -> "True";
                case "string" -> "''";
                default -> "";
            };
        }
        stringBuilder.append(returnValueExpression);
        stringBuilder.append("\n\treturn answer");
        return stringBuilder.toString();
    }

    private String makeJavaInitCode(List<ProblemParameter> problemParameters, ProblemReturn problemReturn) {
        StringBuilder stringBuilder = new StringBuilder();
        String returnDataTypeExpression = "";
        String returnDataTypeName = problemReturn.getDataType().getName();
        returnDataTypeExpression = getJavaDataTypeExpression(returnDataTypeName);
        stringBuilder.append(returnDataTypeExpression);
        stringBuilder.append("solution(");
        final int parameterCount = problemParameters.size();
        for (int idx = 0; idx < parameterCount; idx++) {
            ProblemParameter parameter = problemParameters.get(idx);
            String paramDataTypeName = parameter.getDataType().getName();
            stringBuilder.append(getJavaDataTypeExpression(paramDataTypeName));
            stringBuilder.append(parameter.getName());
            if (idx != parameterCount - 1)
                stringBuilder.append(", ");
        }
        stringBuilder.append(")\n{\n\t");
        stringBuilder.append(returnDataTypeExpression);
        stringBuilder.append("answer = ");
        stringBuilder.append(getJavaValueExpression(returnDataTypeName));
        stringBuilder.append(";\n\treturn answer;\n}");
        return stringBuilder.toString();
    }

    private String getJavaValueExpression(String dataTypeName) {
        return switch (dataTypeName) {
            case "integer", "long", "double" -> "0";
            case "integerArray" -> "new int[]{}";
            case "longArray" -> "new long[]{}";
            case "doubleArray" -> "new double[]{}";
            case "boolean" -> "true";
            case "booleanArray" -> "new boolean[]{}";
            case "string" -> "\"\"";
            case "stringArray" -> "new String[]{}";
            default -> "null";
        };
    }

    private String getJavaDataTypeExpression(String dataTypeName) {
        return switch (dataTypeName) {
            case "integer" -> "int ";
            case "integerArray" -> "int[] ";
            case "integer_2dArray" -> "int[][] ";
            case "long" -> "long ";
            case "longArray" -> "long[] ";
            case "long_2dArray" -> "long[][] ";
            case "double" -> "double ";
            case "doubleArray" -> "double[] ";
            case "double_2dArray" -> "double[][] ";
            case "boolean" -> "boolean ";
            case "booleanArray" -> "boolean[] ";
            case "string" -> "String ";
            case "stringArray" -> "String[] ";
            default -> "void ";
        };
    }

    public String getCppDataTypeExpression(String dataTypeName) {
        return switch (dataTypeName) {
            case "integer" -> "int ";
            case "integerArray" -> "std::vector<int> ";
            case "long" -> "long ";
            case "longArray" -> "std::vector<long> ";
            case "double" -> "double ";
            case "doubleArray" -> "std::vector<double> ";
            case "boolean" -> "bool ";
            case "booleanArray" -> "std::vector<bool> ";
            case "string" -> "std::string ";
            case "stringArray" -> "std::vector<std::string> ";
            default -> "void ";
        };
    }

    public String getCppParameterValueExpression(String dataTypeName, String value) {
        return switch (dataTypeName) {
            case "integer", "long", "double", "boolean", "string" -> value;
            case "integerArray", "longArray", "doubleArray", "booleanArray", "stringArray" -> {
                String prefix = getCppDataTypeExpression(dataTypeName);
                yield prefix + value.replaceAll("\\[", "{").replaceAll("\\]", "}");
            }
            default -> "";
        };
    }

    public String getCppAnswerValueExpression(String dataTypeName) {
        String dataTypeExpression;
        if (dataTypeName.endsWith("Array")) 
        {
            dataTypeExpression = "{}";
            return dataTypeExpression;
        }
        dataTypeExpression = switch (dataTypeName) {
            case "integer", "long", "double" -> "0";
            case "boolean" -> "true";
            case "string" -> "\"\"";
            default -> "nullptr";
        };
        return dataTypeExpression;
    }
}