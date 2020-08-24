package com.goodperson.code.expert.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.goodperson.code.expert.dto.CompileErrorDto;
import com.goodperson.code.expert.dto.MarkResultDto;
import com.goodperson.code.expert.model.Language;
import com.goodperson.code.expert.model.ProblemParameter;
import com.goodperson.code.expert.model.ProblemParameterValue;
import com.goodperson.code.expert.model.ProblemReturn;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class CompileManager {

    @Autowired
    private CodeGenerateManager codeGenerateManager;

    @Autowired
    private FileUtils fileUtils;

    @Value("${compiler.file.java.path}")
    private String javaCompilerPath;
    @Value("${compiler.file.cpp.path}")
    private String cppCompilerPath;
    @Value("${compiler.file.python.path}")
    private String pythonCompilerPath;

    @Value("${problem.compile.file.directory}")
    private String compileFileDirectory;

    public CompileOption makeCompileOption(List<ProblemParameter> problemParameters, ProblemReturn problemReturn,
            List<ProblemParameterValue> problemParameterValues, String returnValue, int timeLimitInMilliseconds,
            String fullCode, int memoryLimitInMegaBytes, Language language) {
        CompileOption compileOption = new CompileOption();
        List<String> parameters = new ArrayList<>();
        int paramLength = problemParameters.size();

        for (int paramIdx = 0; paramIdx < paramLength; paramIdx++) {
            String paramDataType = problemParameters.get(paramIdx).getDataType().getName();
            String paramValue = problemParameterValues.get(paramIdx).getValue();
            parameters.add(paramDataType.concat(":").concat(paramValue));
        }
        String returnDataType = problemReturn.getDataType().getName();
        compileOption.setTimeLimitInMilliseconds(timeLimitInMilliseconds);
        compileOption.setParameters(parameters);
        compileOption.setAnswer(returnDataType.concat(":").concat(returnValue));
        compileOption.setCode(fullCode);
        compileOption.setMemoryLimitInMegaBytes(memoryLimitInMegaBytes);
        compileOption.setLanguage(language);
        return compileOption;
    }

    private String getValidateCode(String compilerFilePath) {
        try {
            ClassPathResource resource = new ClassPathResource(compilerFilePath);
            try (InputStream is = resource.getInputStream()) {
                String validateCode = IOUtils.toString(is, "UTF-8");
                return validateCode;
            }
        } catch (Exception e) {
            return "";
        }
    }

    private File makeCompileDirectory() {
        String workPath = System.getProperty("user.home");
        File compileDirectory = new File(workPath + "/" + compileFileDirectory);
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

    public String makePythonFullCode(String code) {
        final String validateCode = getValidateCode(pythonCompilerPath);
        code = code + "\n" + validateCode;
        return code.replaceAll("\t", "    "); // tab-> 공백 4개(indent error 방지)
    }

    public MarkResultDto compilePython(CompileOption compileOption, CompileErrorDto compileErrorDto) {
        MarkResultDto markResultDto = null;
        try {
            File compileDirectory = makeCompileDirectory();
            File compileFile = makeCompileFile(compileDirectory, compileOption.getCode(), LocalDateTime.now(), "py");
            compileOption.setCompileFile(compileFile);
            List<String> commands = new ArrayList<>();
            commands.add("python3");
            commands.add(compileFile.getAbsolutePath());
            commands.add(String.valueOf(compileOption.getTimeLimitInMilliseconds()));
            commands.addAll(compileOption.getParameters());
            commands.add(compileOption.getAnswer());
            markResultDto = execCodeAndGetMarkResult(commands, compileOption);
            deleteCompiledOrExecFile(compileFile);
            return markResultDto;
        } catch (Exception e) {
            e.printStackTrace();
            compileErrorDto.setCompileError(true);
            return markResultDto;
        }
    }

    // "import java.util.Arrays;\nimport java.util.stream.Collectors;\n
    private String[] splitJavaCodeToImportPartAndImplementCodePart(String code) {
        Matcher matcher = Pattern.compile("import\\s+[\\w.]+;").matcher(code);
        boolean isFirstMatch = true;
        int importStartIndex = -1;
        int importEndIndex = -1;
        while (matcher.find()) {
            if (isFirstMatch) {
                importStartIndex = matcher.start();
                isFirstMatch = false;
            }
            importEndIndex = matcher.end();
        }
        String importCode;
        String implementCode;
        if (importStartIndex == -1 || importEndIndex == -1) {
            importCode = "";
            implementCode = code;
        } else {
            importCode = code.substring(importStartIndex, importEndIndex);
            implementCode = code.substring(importEndIndex + 1);
        }
        return new String[] { importCode, implementCode };
    }

    private String removePackageCodeFromValidateCode(String validateCode) {
        StringBuffer removedCode = new StringBuffer(validateCode.replaceAll("package\\s+[\\w+.]+;", ""));
        return removedCode.delete(removedCode.lastIndexOf("}"), removedCode.length()).toString();
    }

    public String makeJavaFullCode(String code) {
        final String validateCode = removePackageCodeFromValidateCode(getValidateCode(javaCompilerPath));
        String[] codeParts = splitJavaCodeToImportPartAndImplementCodePart(code);
        code = codeParts[0].concat("\n").concat(validateCode).concat("\n").concat(codeParts[1]).concat("\n}");
        return code;
    }

    public MarkResultDto compileJava(CompileOption compileOption, CompileErrorDto compileErrorDto) {
        MarkResultDto markResultDto = null;
        try {
            File compileDirectory = makeCompileDirectory();
            File compileFile = makeCompileFile(compileDirectory, compileOption.getCode(), LocalDateTime.now(), "java");
            compileOption.setCompileFile(compileFile);
            List<String> commands = new ArrayList<>();
            commands.add("java");
            commands.add(compileFile.getAbsolutePath());
            commands.add(String.valueOf(compileOption.getTimeLimitInMilliseconds()));
            commands.addAll(compileOption.getParameters());
            commands.add(compileOption.getAnswer());
            markResultDto = execCodeAndGetMarkResult(commands, compileOption);
            deleteCompiledOrExecFile(compileFile);
            return markResultDto;
        } catch (Exception e) {
            compileErrorDto.setCompileError(true);
            return markResultDto;
        }
    }

    private void deleteCompiledOrExecFile(File... files) {
        if (files != null) {
            for (File file : files) {
                file.delete();
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
                parameterValues.append(", ");
        }
        String input = parameterValues.toString().replaceAll("\"", "");
        return validateCode.replaceAll("\\{\\{answerDataType\\}\\}", answerDataType)
                .replace("{{answerValue}}", answerValue).replace("{{parameterValues}}", parameterValues.toString())
                .replace("{{input}}", input);
    }

    private String makeCppFullCode(CompileOption compileOption) {
        final String validateCode = applyDetailToCppValidateCode(getValidateCode(cppCompilerPath),
                compileOption.getParameters(), compileOption.getAnswer());
        return compileOption.getCode().concat("\n").concat(validateCode);
    }

    public MarkResultDto compileCpp(CompileOption compileOption, CompileErrorDto compileErrorDto) {
        MarkResultDto markResultDto = null;
        try {
            LocalDateTime now = LocalDateTime.now();
            compileOption.setCode(makeCppFullCode(compileOption));
            final String compileFileExtension = "cpp";
            File compileDirectory = makeCompileDirectory();
            final String execFileName = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS")) + "_exec.out";
            File compileFile = makeCompileFile(compileDirectory, compileOption.getCode(), now, compileFileExtension);
            File execFile = new File(compileDirectory, execFileName);
            final String compileFileFullPath = compileFile.getAbsolutePath();
            compileOption.setCompileFile(compileFile);
            String[] compileCommands = new String[] { "clang++", "-pthread", "-w", "-std=c++1z",
                    compileFile.getAbsolutePath(), "-o", execFile.getAbsolutePath() };
            List<String> execCommands = new ArrayList<>();
            execCommands.add(execFile.getAbsolutePath());
            execCommands.add(String.valueOf(compileOption.getTimeLimitInMilliseconds()));
            Runtime runtime = Runtime.getRuntime();

            Process compileProcess = runtime.exec(compileCommands);
            compileProcess.waitFor(10000, TimeUnit.MILLISECONDS);
            // 다른 언어는 컴파일후 바로 실행 결과가 나오지만 c++은 컴파일 후, 실행 파일을 실행한다.

            // 코드 컴파일
            try (BufferedReader compileError = new BufferedReader(
                    new InputStreamReader(compileProcess.getErrorStream()));) {
                markResultDto = new MarkResultDto();
                String line = "";
                StringBuffer errorBuffer = new StringBuffer();
                while ((line = compileError.readLine()) != null) {
                    line = line.replaceAll(compileFileFullPath, "solution.".concat(compileFileExtension));
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
            markResultDto = execCodeAndGetMarkResult(execCommands, compileOption);
            deleteCompiledOrExecFile(compileFile, execFile);
            return markResultDto;
        } catch (Exception e) {
            e.printStackTrace();
            compileErrorDto.setCompileError(true);
            return markResultDto;
        }
    }

    private boolean isOutOfMemory(String languageName, String errorMessage){
        switch(languageName){
            case "cpp":
                return errorMessage.contains("std::bad_alloc");
            case "python3":
                return errorMessage.contains("MemoryError:");
            case "java":
                return errorMessage.contains("java.lang.OutOfMemoryError");
            default:
                return false;
        }
    }

    // 코드 실행 결과 가져오는 메소드
    private MarkResultDto execCodeAndGetMarkResult(List<String> commands, CompileOption compileOption)
            throws Exception {
        final Runtime runtime = Runtime.getRuntime();
        MarkResultDto markResultDto = new MarkResultDto();

        StringBuffer errorBuffer = new StringBuffer();
        StringBuffer outputBuffer = new StringBuffer();
        final File compileFile = compileOption.getCompileFile();
        final int timeLimitInMilliseconds = compileOption.getTimeLimitInMilliseconds();
        int memoryLimitInMegaBytes = compileOption.getMemoryLimitInMegaBytes();
        final String compileFileFullPath = compileFile.getAbsolutePath();
        final String compileFileName = compileFile.getName();
        final String compileFileExtension = fileUtils.getFileExtension(compileFileFullPath);
        final String languageName = compileOption.getLanguage().getName();
        String[] execCommand;
        // 메모리 제한 명령어 생성

        // java인 경우 JVM 자체의 메모리 제한을 둠.
        final String laguageName = compileOption.getLanguage().getName();
        if(laguageName.equals("java")){
            commands.add(1,"-Xms"+"1m"); // JVM 초기 힙 크기
            commands.add(2,"-Xmx"+memoryLimitInMegaBytes/2 +"m"); // JVM 최대 힙 크기
            commands.add(3,"-Xss"+memoryLimitInMegaBytes/2 +"m"); // JVM 최대 스택 크기
            execCommand = commands.toArray(String[]::new);
        }
        else{
             // ulimit: 프로세스 제한 명령어 
            // (ulimit -m 물리적 메모리 제한 용량(KB) ; 실행할 프로세스 명령어)
            execCommand = new String[]
            {
            "/bin/sh",
            "-c",
            "(ulimit -v "+(memoryLimitInMegaBytes*1024+"; "+ commands.stream().collect(Collectors.joining(" "))+")")
            };
        }

        Process execProcess =  runtime.exec(execCommand);
        execProcess.waitFor(timeLimitInMilliseconds + 5000, TimeUnit.MILLISECONDS);
        boolean isTimeOut = false;
        boolean isAnswer = false;
        Double timeElapsed = null;
        String input = null;
        String expected = null;
        String actual = null;
        String errorMessage = null;
        String outputMessage = null;
        String line = "";
        try (BufferedReader execInput = new BufferedReader(new InputStreamReader(execProcess.getInputStream()));
                BufferedReader execError = new BufferedReader(new InputStreamReader(execProcess.getErrorStream()));) {
            while ((line = execError.readLine()) != null) {
                line = line.replaceAll("^\\s+", "").replaceAll(compileFileFullPath + "|" + compileFileName,
                        "solution".concat(compileFileExtension));
                if (line.isEmpty())
                    continue;
                if (line.startsWith("$timeout|")) {
                    isTimeOut = true;
                    timeElapsed = (double) timeLimitInMilliseconds;
                }
                else {
                    errorBuffer.append(line);
                    errorBuffer.append("\n");
                }
            }

            while ((line = execInput.readLine()) != null) {
                if (line.isEmpty())
                    continue;
                line = line.replaceAll(compileFileFullPath, "solution".concat(compileFileExtension));
                String trimmedLine = line.trim();
                if (trimmedLine.equals("$answer|")) {
                    isAnswer = true;
                } else if (trimmedLine.equals("$notAnswer|")) {
                    isAnswer = false;
                } else if (trimmedLine.startsWith("$input|")) {
                    input = line.split("\\|")[1];
                } else if (trimmedLine.startsWith("$expected|")) {
                    expected = line.split("\\|")[1];
                } else if (trimmedLine.startsWith("$actual|")) {
                    actual = line.split("\\|")[1];
                } else if (trimmedLine.startsWith("$time|")) {
                    String[] splitted = line.split("\\|");
                    timeElapsed = Double.valueOf(splitted[1]);
                } else {
                    outputBuffer.append(line);
                    outputBuffer.append("\n");
                }
            }
            errorMessage = errorBuffer.toString();
            outputMessage = outputBuffer.toString();
            // 에러 메시지 앞부분 생략
            if(languageName.equals("java")){
                int lastErrorStackIndex = errorMessage.lastIndexOf("Caused by:");
                if(lastErrorStackIndex != -1){
                    errorMessage = errorMessage.substring(lastErrorStackIndex);
                }
            }
        } catch (Exception e) {
            errorMessage = e.getMessage();
        } finally {
            markResultDto.setActual(actual);
            markResultDto.setErrorMessage(errorMessage);
            markResultDto.setInput(input);
            markResultDto.setExpected(expected);
            markResultDto.setIsAnswer(isAnswer);
            markResultDto.setIsTimeOut(isTimeOut);
            markResultDto.setIsOutOfMemory(isOutOfMemory(languageName, errorMessage));
            markResultDto.setOutputMessage(outputMessage);
            markResultDto.setTimeElapsed(timeElapsed);
        }
        return markResultDto;
    }
}