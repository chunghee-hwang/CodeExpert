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
        switch (language.getName()) {
            case "java":
                return makeJavaInitCode(problemParameters, problemReturn);
            case "cpp":
                return makeCppInitCode(problemParameters, problemReturn);
            case "python3":
                return makePythonInitCode(problemParameters, problemReturn);
        }
        return "An error occurred while the code is initialized.";
    }

    private String makeCppInitCode(List<ProblemParameter> problemParameters, ProblemReturn problemReturn) {
        StringBuilder stringBuilder = new StringBuilder(
                "#include <string>\n#include <vector>\nusing namespace std;\n\n");
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
        if (returnDataTypeName.endsWith("2d_array")) {
            returnValueExpression = "[[]]";
        } else if (returnDataTypeName.endsWith("_array")) {
            returnValueExpression = "[]";
        } else {
            switch (returnDataTypeName) {
                case "integer":
                case "long":
                case "double":
                    returnValueExpression = "0";
                    break;
                case "boolean":
                    returnValueExpression = "true";
                    break;
                case "string":
                    returnValueExpression = "''";
                    break;
                default:
                    returnValueExpression = "";
                    break;
            }
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
        stringBuilder.append(";\nreturn answer;\n}");
        return stringBuilder.toString();
    }

    private String getJavaValueExpression(String dataTypeName) {
        String dataTypeValue;
        switch (dataTypeName) {
            case "integer":
            case "long":
            case "double":
                dataTypeValue = "0";
                break;
            case "integer_array":
                dataTypeValue = "new int[]{}";
                break;
            case "integer_2d_array":
                dataTypeValue = "new int[][]{}";
                break;
            case "long_array":
                dataTypeValue = "new long[]{}";
                break;
            case "long_2d_array":
                dataTypeValue = "new long[][]{}";
                break;
            case "double_array":
                dataTypeValue = "new double[]{}";
                break;
            case "double_2d_array":
                dataTypeValue = "new double[][]{}";
                break;
            case "boolean":
                dataTypeValue = "true";
                break;
            case "boolean_array":
                dataTypeValue = "new boolean[]{}";
                break;
            case "string":
                dataTypeValue = "\"\"";
                break;
            case "string_array":
                dataTypeValue = "new String[]{}";
                break;
            default:
                dataTypeValue = "null";
                break;
        }
        return dataTypeValue;
    }

    private String getJavaDataTypeExpression(String dataTypeName) {
        String dataTypeExpression;
        switch (dataTypeName) {
            case "integer":
                dataTypeExpression = "int ";
                break;
            case "integer_array":
                dataTypeExpression = "int[] ";
                break;
            case "integer_2d_array":
                dataTypeExpression = "int[][] ";
                break;
            case "long":
                dataTypeExpression = "long ";
                break;
            case "long_array":
                dataTypeExpression = "long[] ";
                break;
            case "long_2d_array":
                dataTypeExpression = "long[][] ";
                break;
            case "double":
                dataTypeExpression = "double ";
                break;
            case "double_array":
                dataTypeExpression = "double[] ";
                break;
            case "double_2d_array":
                dataTypeExpression = "double[][] ";
                break;
            case "boolean":
                dataTypeExpression = "boolean ";
                break;
            case "boolean_array":
                dataTypeExpression = "boolean[] ";
                break;
            case "string":
                dataTypeExpression = "String ";
                break;
            case "string_array":
                dataTypeExpression = "String[] ";
                break;
            default:
                dataTypeExpression = "void ";
                break;
        }
        return dataTypeExpression;
    }

    public String getCppDataTypeExpression(String dataTypeName) {
        String dataTypeExpression;
        switch (dataTypeName) {
            case "integer":
                dataTypeExpression = "int ";
                break;
            case "integer_array":
                dataTypeExpression = "std::vector<int> ";
                break;
            case "long":
                dataTypeExpression = "long ";
                break;
            case "long_array":
                dataTypeExpression = "std::vector<long> ";
                break;
            case "double":
                dataTypeExpression = "double ";
                break;
            case "double_array":
                dataTypeExpression = "std::vector<double> ";
                break;
            case "boolean":
                dataTypeExpression = "bool ";
                break;
            case "boolean_array":
                dataTypeExpression = "std::vector<boolean> ";
                break;
            case "string":
                dataTypeExpression = "std::string ";
                break;
            case "string_array":
                dataTypeExpression = "std::vector<string> ";
                break;
            default:
                dataTypeExpression = "void ";
                break;
        }
        return dataTypeExpression;
    }

    public String getCppParameterValueExpression(String dataTypeName, String value) {
        String valueExpression;
        switch (dataTypeName) {
            case "integer":
            case "long":
            case "double":
            case "boolean":
            case "string":
                valueExpression = value;
                break;
            case "integer_array":
            case "long_array":
            case "double_array":
            case "boolean_array":
            case "string_array":
                String prefix = getCppDataTypeExpression(dataTypeName);
                valueExpression = prefix + value.replace("[", "{").replace("]", "}");
                break;
            default:
                valueExpression = "";
                break;
        }
        return valueExpression;
    }

    public String getCppAnswerValueExpression(String dataTypeName) {
        String dataTypeExpression;
        if (dataTypeName.endsWith("2d_array")) {
            dataTypeExpression = "{{}}";
        } else if (dataTypeName.endsWith("_array")) {
            dataTypeExpression = "{}";
        }
        switch (dataTypeName) {
            case "integer":
            case "long":
            case "double":
                dataTypeExpression = "0";
                break;
            case "boolean":
                dataTypeExpression = "true";
                break;
            case "string":
                dataTypeExpression = "\"\"";
                break;
            default:
                dataTypeExpression = "nullptr";
                break;
        }
        return dataTypeExpression;
    }
}