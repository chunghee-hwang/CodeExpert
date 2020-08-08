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
        if (returnDataTypeName.endsWith("Array")) {
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
            case "integerArray":
                dataTypeValue = "new int[]{}";
                break;
            case "longArray":
                dataTypeValue = "new long[]{}";
                break;
            case "doubleArray":
                dataTypeValue = "new double[]{}";
                break;
            case "boolean":
                dataTypeValue = "true";
                break;
            case "booleanArray":
                dataTypeValue = "new boolean[]{}";
                break;
            case "string":
                dataTypeValue = "\"\"";
                break;
            case "stringArray":
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
            case "integerArray":
                dataTypeExpression = "int[] ";
                break;
            case "integer_2dArray":
                dataTypeExpression = "int[][] ";
                break;
            case "long":
                dataTypeExpression = "long ";
                break;
            case "longArray":
                dataTypeExpression = "long[] ";
                break;
            case "long_2dArray":
                dataTypeExpression = "long[][] ";
                break;
            case "double":
                dataTypeExpression = "double ";
                break;
            case "doubleArray":
                dataTypeExpression = "double[] ";
                break;
            case "double_2dArray":
                dataTypeExpression = "double[][] ";
                break;
            case "boolean":
                dataTypeExpression = "boolean ";
                break;
            case "booleanArray":
                dataTypeExpression = "boolean[] ";
                break;
            case "string":
                dataTypeExpression = "String ";
                break;
            case "stringArray":
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
            case "integerArray":
                dataTypeExpression = "std::vector<int> ";
                break;
            case "long":
                dataTypeExpression = "long ";
                break;
            case "longArray":
                dataTypeExpression = "std::vector<long> ";
                break;
            case "double":
                dataTypeExpression = "double ";
                break;
            case "doubleArray":
                dataTypeExpression = "std::vector<double> ";
                break;
            case "boolean":
                dataTypeExpression = "bool ";
                break;
            case "booleanArray":
                dataTypeExpression = "std::vector<boolean> ";
                break;
            case "string":
                dataTypeExpression = "std::string ";
                break;
            case "stringArray":
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
            case "integerArray":
            case "longArray":
            case "doubleArray":
            case "booleanArray":
            case "stringArray":
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
        if (dataTypeName.endsWith("Array")) 
        {
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