package com.goodperson.code.expert.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import com.goodperson.code.expert.dto.MarkResultDto;
import com.goodperson.code.expert.model.ProblemParameter;
import com.goodperson.code.expert.model.ProblemParameterValue;
import com.goodperson.code.expert.model.ProblemReturn;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CompileManager {

    @Autowired
    private CodeGenerateManager codeGenerateManager;

    public CompileOption makeCompileOptionCommands(List<ProblemParameter> problemParameters,
            ProblemReturn problemReturn, List<ProblemParameterValue> problemParameterValues, String returnValue,
            int timeOutInMilliseconds) {
        CompileOption compileOption = new CompileOption();
        List<String> parameters = new ArrayList<>();
        // 500(timeout),
        // "integer_array:[1, 2, 3, 4]", "integer:10"

        int paramLength = problemParameters.size();

        for (int paramIdx = 0; paramIdx < paramLength; paramIdx++) {
            String paramDataType = problemParameters.get(paramIdx).getDataType().getName();
            String paramValue = problemParameterValues.get(paramIdx).getValue();
            parameters.add(paramDataType.concat(":").concat(paramValue));
        }
        String returnDataType = problemReturn.getDataType().getName();
        compileOption.setTimeOutInMilliseconds(timeOutInMilliseconds);
        compileOption.setParameters(parameters);
        compileOption.setAnswer(returnDataType.concat(":").concat(returnValue));
        return compileOption;
    }

    private String getValidateCode(String relativeCompilerFilePath) throws IOException {
        String workPath = System.getProperty("user.dir");
        final Path validaterFilePath = Paths.get(workPath + relativeCompilerFilePath);

        return Files.readString(validaterFilePath);
    }

    private File makeCompileDirectory() {
        String workPath = System.getProperty("user.home");
        File compileDirectory = new File(workPath + "/code_expert_compile");
        if (!compileDirectory.exists())
            compileDirectory.mkdirs();
        return compileDirectory;
    }

    private File makeCompileFile(final File compileDirectory, final String code, final LocalDateTime now,
            String fileExtension) throws IOException {
        File compileFile = new File(compileDirectory,
                now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS")) + "." + fileExtension);
        compileFile.createNewFile();
        try (FileWriter fileWriter = new FileWriter(compileFile, false);) {
            fileWriter.write(code);
        }
        return compileFile;
    }

    public MarkResultDto compilePython(String code, CompileOption compileOption) throws Exception {
        LocalDateTime now = LocalDateTime.now();
        final String validateCode = getValidateCode("/src/test/java/com/goodperson/code/expert/python_compiler.py");
        code = code + "\n" + validateCode;
        File compileDirectory = makeCompileDirectory();
        File compileFile = makeCompileFile(compileDirectory, code, now, "py");
        List<String> commands = new ArrayList<>();
        final int timeOutInMilliseconds = compileOption.getTimeOutInMilliseconds();
        commands.add("python3");
        commands.add(compileFile.getAbsolutePath());
        commands.add(String.valueOf(timeOutInMilliseconds));
        commands.addAll(compileOption.getParameters());
        commands.add(compileOption.getAnswer());
        MarkResultDto markResultDto = execCodeAndGetMarkResult(commands.toArray(String[]::new), timeOutInMilliseconds);
        deleteCompiledOrExecFile(compileFile);
        return markResultDto;
    }

    // "import java.util.Arrays;\nimport java.util.stream.Collectors;\n
    private String[] splitJavaCodeToImportPartAndImplementCodePart(String code) {
        StringBuffer importCode = new StringBuffer();
        StringBuffer implementCode = new StringBuffer();
        String[] lines = code.split("(?<=;)(?<=\n)?");

        for (String line : lines) {
            line = line.replaceAll("^\\s+", "");
            if (line.startsWith("import")) {
                importCode.append(line);
            } else {
                implementCode.append(line);
            }
        }

        return new String[] { importCode.toString(), implementCode.toString() };
    }

    private String removePackageCodeFromValidateCode(String validateCode) {
        StringBuffer removedCode = new StringBuffer(validateCode.replaceAll("package\\s+[\\w+.]+;", ""));
        return removedCode.delete(removedCode.lastIndexOf("}"), removedCode.length()).toString();
    }

    public MarkResultDto compileJava(String code, CompileOption compileOption) throws Exception {
        LocalDateTime now = LocalDateTime.now();
        final String validateCode = removePackageCodeFromValidateCode(
                getValidateCode("/src/test/java/com/goodperson/code/expert/JavaCompiler.java"));
        String[] codeParts = splitJavaCodeToImportPartAndImplementCodePart(code);

        code = codeParts[0].concat("\n").concat(validateCode).concat("\n").concat(codeParts[1]).concat("\n}");
        File compileDirectory = makeCompileDirectory();
        File compileFile = makeCompileFile(compileDirectory, code, now, "java");
        List<String> commands = new ArrayList<>();
        final int timeOutInMilliseconds = compileOption.getTimeOutInMilliseconds();
        commands.add("java");
        commands.add(compileFile.getAbsolutePath());
        commands.add(String.valueOf(timeOutInMilliseconds));
        commands.addAll(compileOption.getParameters());
        commands.add(compileOption.getAnswer());
        MarkResultDto markResultDto = execCodeAndGetMarkResult(commands.toArray(String[]::new), timeOutInMilliseconds);
        deleteCompiledOrExecFile(compileFile);
        return markResultDto;
    }

    private void deleteCompiledOrExecFile(File... files) {
        if (files != null) {
            for (File file : files) {
                file.deleteOnExit();
            }
        }
    }

    // CppCompiler.cpp의 {{answerDataType}}를 정답 데이터 타입으로, {{answerValue}}를 정답 값으로,
    // {{parameterValues}}는 파라미터 값으로 바꾸는 메소드
    private String applyDetailToCppValidateCode(String validateCode, List<String> parameters, String answer) {
        String answerDataType;
        String answerValue;
        StringBuffer parameterValues = new StringBuffer();
        String[] answerDataTypeAndValue = answer.split(":");
        answerDataType = codeGenerateManager.getCppDataTypeExpression(answerDataTypeAndValue[0]);
        answerValue = codeGenerateManager.getCppParameterValueExpression(answerDataTypeAndValue[0],
                answerDataTypeAndValue[1]);
        final int parameterSize = parameters.size();
        for (int idx = 0; idx < parameterSize; idx++) {
            String[] parameterDataTypeAndValue = parameters.get(idx).split(":");
            parameterValues.append(codeGenerateManager.getCppParameterValueExpression(parameterDataTypeAndValue[0],
                    parameterDataTypeAndValue[1]));
            if (idx != parameterSize - 1)
                parameterValues.append(",");
        }
        return validateCode.replaceAll("\\{\\{answerDataType\\}\\}", answerDataType)
                .replace("{{answerValue}}", answerValue).replace("{{parameterValues}}", parameterValues.toString());
    }

    public MarkResultDto compileCpp(String code, CompileOption compileOption) throws Exception {

        LocalDateTime now = LocalDateTime.now();
        final String validateCode = applyDetailToCppValidateCode(
                getValidateCode("/src/test/java/com/goodperson/code/expert/CppCompiler.cpp"),
                compileOption.getParameters(), compileOption.getAnswer());
        code = code.concat("\n").concat(validateCode);
        File compileDirectory = makeCompileDirectory();
        File compileFile = makeCompileFile(compileDirectory, code, now, "cpp");
        final String execFileName = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS")) + "_exec.out";
        File execFile = new File(compileDirectory, execFileName);
        final int timeOutInMilliseconds = compileOption.getTimeOutInMilliseconds();
        String[] compileCommands = new String[] { "clang++", "-pthread", "-std=c++1z", compileFile.getAbsolutePath(),
                "-o", execFile.getAbsolutePath() };
        String[] execCommands = new String[] { execFile.getAbsolutePath(), String.valueOf(timeOutInMilliseconds) };
        Runtime runtime = Runtime.getRuntime();

        Process compileProcess = runtime.exec(compileCommands);
        compileProcess.waitFor();

        // 다른 언어는 컴파일후 바로 실행 결과가 나오지만 c++은 컴파일 후, 실행 파일을 실행한다.

        // 코드 컴파일
        try (BufferedReader compileError = new BufferedReader(
                new InputStreamReader(compileProcess.getErrorStream()));) {
            MarkResultDto markResultDto = new MarkResultDto();
            String line = "";
            StringBuffer errorBuffer = new StringBuffer();
            while ((line = compileError.readLine()) != null) {
                errorBuffer.append(line);
                errorBuffer.append("\n");
            }
            if (errorBuffer.length() != 0) {
                markResultDto.setIsAnswer(false);
                markResultDto.setErrorMessage(errorBuffer.toString());
                deleteCompiledOrExecFile(compileFile);
                return markResultDto;
            }
        }

        // 실행
        MarkResultDto markResultDto = execCodeAndGetMarkResult(execCommands, timeOutInMilliseconds);
        deleteCompiledOrExecFile(compileFile, execFile);
        return markResultDto;
    }

    // 코드 실행 결과 가져오는 메소드
    private MarkResultDto execCodeAndGetMarkResult(String[] command, final int timeOutInMilliseconds) throws Exception {
        final Runtime runtime = Runtime.getRuntime();
        MarkResultDto markResultDto = new MarkResultDto();
        final Process execProcess = runtime.exec(command);
        execProcess.waitFor();
        try (BufferedReader execInput = new BufferedReader(new InputStreamReader(execProcess.getInputStream()));
                BufferedReader execError = new BufferedReader(new InputStreamReader(execProcess.getErrorStream()));) {
            String line = "";
            StringBuffer errorBuffer = new StringBuffer();
            StringBuffer outputBuffer = new StringBuffer();
            boolean isTimeOut = false;
            boolean isAnswer = false;
            Double timeElapsed = null;
            String expected = null;
            String actual = null;
            String errorMessage = null;
            String outputMessage = null;

            while ((line = execError.readLine()) != null) {
                if (line.startsWith("$timeout|")) {
                    isTimeOut = true;
                    timeElapsed = (double) timeOutInMilliseconds;
                    break;
                } else {
                    errorBuffer.append(line);
                    errorBuffer.append("\n");
                }
            }
            while ((line = execInput.readLine()) != null) {
                if (line.equals("$answer|")) {
                    isAnswer = true;
                } else if (line.startsWith("$not_answer|")) {
                    String[] splitted = line.split("\\|");
                    expected = splitted[1];
                    actual = splitted[2];
                } else if (line.startsWith("$time|")) {
                    String[] splitted = line.split("\\|");
                    timeElapsed = Double.valueOf(splitted[1]);
                } else {
                    outputBuffer.append(line);
                    outputBuffer.append("\n");
                }
            }
            errorMessage = errorBuffer.toString();
            outputMessage = outputBuffer.toString();

            markResultDto.setActual(actual);
            markResultDto.setErrorMessage(errorMessage);
            markResultDto.setExpected(expected);
            markResultDto.setIsAnswer(isAnswer);
            markResultDto.setIsTimeOut(isTimeOut);
            markResultDto.setOutputMessage(outputMessage);
            markResultDto.setTimeElapsed(timeElapsed);
            return markResultDto;
        }
    }
}