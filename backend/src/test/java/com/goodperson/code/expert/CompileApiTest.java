package com.goodperson.code.expert;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.goodperson.code.expert.dto.CompileResultDto;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class CompileApiTest {

    @Test
    public void CompilePythonTest() throws Exception {
        String code = "import time\ndef solution(array):\n\tfor _ in range(500000):\n\t\tpass\n\ttime.sleep(0.1)\n\treturn sum(array)\n";
        CompileResultDto compileResultDto = compilePython(code, 1000);
        System.out.println(compileResultDto);
    }

    private CompileResultDto compilePython(String code, int timeOutInMiliseconds) throws Exception {
        LocalDateTime now = LocalDateTime.now();
        final Path validaterFilePath = Paths
                .get("D:/Programming/CodeExpert/backend/src/test/java/com/goodperson/code/expert/python_compiler.py");

        final String validateCode = Files.readString(validaterFilePath);
        code = code + "\n" + validateCode;
        File compileDirectory = new File("C:/code_expert/compile/", now.format(DateTimeFormatter.BASIC_ISO_DATE));
        if (!compileDirectory.exists())
            compileDirectory.mkdirs();

        File compileFile = new File(compileDirectory,
                now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS")) + ".py");
        compileFile.createNewFile();
        try (FileWriter fileWriter = new FileWriter(compileFile, false);) {
            fileWriter.write(code);
        }

        String[] commands = new String[] { "python", compileFile.getAbsolutePath(), "timeout:" + timeOutInMiliseconds,
                "integer_array:[1, 2, 3, 4]", "integer:10" };

        Runtime runtime = Runtime.getRuntime();

        Process process = runtime.exec(commands);
        process.waitFor();
        try (BufferedReader error = new BufferedReader(new InputStreamReader(process.getErrorStream()));
                BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));) {
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
            while ((line = error.readLine()) != null) {
                if (line.startsWith("$timeout|")) {
                    isTimeOut = true;
                    timeElapsed = (double) timeOutInMiliseconds;
                    break;
                } else {
                    errorBuffer.append(line);
                    errorBuffer.append("\n");
                }
            }
            while ((line = input.readLine()) != null) {
                if (line.equals("$answer")) {
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

            CompileResultDto compileResultDto = new CompileResultDto();
            compileResultDto.setActual(actual);
            compileResultDto.setErrorMessage(errorMessage);
            compileResultDto.setExpected(expected);
            compileResultDto.setIsAnswer(isAnswer);
            compileResultDto.setIsTimeOut(isTimeOut);
            compileResultDto.setOutputMessage(outputMessage);
            compileResultDto.setTimeElapsed(timeElapsed);
            compileFile.deleteOnExit();
            return compileResultDto;
        }
    }

    @Test
    public void testCompileJava() throws Exception {
        String code = "import java.util.Arrays;\npublic int solution(int[] array) {return Arrays.stream(array).reduce(0, (a, b) -> a + b);}";
        CompileResultDto compileResultDto = compileJava(code, 100);
        System.out.println(compileResultDto);
    }

    private String[] splitJavaCodeToImportPartAndImplementCodePart(String code) {
        StringBuffer importCode = new StringBuffer();
        StringBuffer implementCode = new StringBuffer();
        String[] lines = code.split("(?<=;)(?<=\n)?");

        for (String line : lines) {
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

    private CompileResultDto compileJava(String code, int timeOutInMiliseconds) throws Exception {
        LocalDateTime now = LocalDateTime.now();
        final Path validaterFilePath = Paths
                .get("D:/Programming/CodeExpert/backend/src/test/java/com/goodperson/code/expert/JavaCompiler.java");

        final String validateCode = removePackageCodeFromValidateCode(Files.readString(validaterFilePath));
        String[] codeParts = splitJavaCodeToImportPartAndImplementCodePart(code);

        code = codeParts[0].concat("\n").concat(validateCode).concat("\n").concat(codeParts[1]).concat("\n}");
        File compileDirectory = new File("C:/code_expert/compile/", now.format(DateTimeFormatter.BASIC_ISO_DATE));
        if (!compileDirectory.exists())
            compileDirectory.mkdirs();

        File compileFile = new File(compileDirectory,
                now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS")) + ".java");
        compileFile.createNewFile();
        try (FileWriter fileWriter = new FileWriter(compileFile, false);) {
            fileWriter.write(code);
        }

        String[] commands = new String[] { "java", compileFile.getAbsolutePath(), "timeout:" + timeOutInMiliseconds,
                "integer_array:[1, 2, 3, 4]", "integer:10" };

        Runtime runtime = Runtime.getRuntime();

        Process process = runtime.exec(commands);
        process.waitFor();
        try (BufferedReader error = new BufferedReader(new InputStreamReader(process.getErrorStream()));
                BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));) {
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
            while ((line = error.readLine()) != null) {
                if (line.startsWith("$timeout|")) {
                    isTimeOut = true;
                    timeElapsed = (double) timeOutInMiliseconds;
                    break;
                } else {
                    errorBuffer.append(line);
                    errorBuffer.append("\n");
                }
            }
            while ((line = input.readLine()) != null) {
                if (line.equals("$answer")) {
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

            CompileResultDto compileResultDto = new CompileResultDto();
            compileResultDto.setActual(actual);
            compileResultDto.setErrorMessage(errorMessage);
            compileResultDto.setExpected(expected);
            compileResultDto.setIsAnswer(isAnswer);
            compileResultDto.setIsTimeOut(isTimeOut);
            compileResultDto.setOutputMessage(outputMessage);
            compileResultDto.setTimeElapsed(timeElapsed);
            compileFile.deleteOnExit();
            return compileResultDto;
        }
    }

    @Test
    public void testCompileCpp() throws Exception {
        String code = "#include <vector>\n#include <numeric>\nint solution(std::vector<int> array)\n{return std::accumulate(array.begin(), array.end(), 0);\n}";
        CompileResultDto compileResultDto = compileCpp(code, 100);
        System.out.println(compileResultDto);
    }

    private CompileResultDto compileCpp(String code, int timeOutInMiliseconds) throws Exception {
        CompileResultDto compileResultDto = new CompileResultDto();
        LocalDateTime now = LocalDateTime.now();
        final Path validaterFilePath = Paths
                .get("D:/Programming/CodeExpert/backend/src/test/java/com/goodperson/code/expert/CppCompiler.cpp");

        final String validateCode = Files.readString(validaterFilePath);
        code = code.concat("\n").concat(validateCode);
        File compileDirectory = new File("C:/code_expert/compile/", now.format(DateTimeFormatter.BASIC_ISO_DATE));
        if (!compileDirectory.exists())
            compileDirectory.mkdirs();

        String datetime = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
        File compileFile = new File(compileDirectory, datetime + ".cpp");
        compileFile.createNewFile();

        final String execFileName = datetime + "_exec.exe";
        File execFile = new File(compileDirectory, execFileName);
        try (FileWriter fileWriter = new FileWriter(compileFile, false);) {
            fileWriter.write(code);
        }

        String[] compileCommands = new String[] { "g++", compileFile.getAbsolutePath(), "-o",
                execFile.getAbsolutePath() };
        String[] execCommands = new String[] { execFile.getAbsolutePath(), "timeout:" + timeOutInMiliseconds,
                "integer_array:[1, 2, 3, 4]", "integer:10" };
        Runtime runtime = Runtime.getRuntime();

        Process compileProcess = runtime.exec(compileCommands);
        compileProcess.waitFor();
        StringBuffer errorBuffer = new StringBuffer();
        try (BufferedReader compileError = new BufferedReader(
                new InputStreamReader(compileProcess.getErrorStream()));) {
            String line = "";

            while ((line = compileError.readLine()) != null) {
                errorBuffer.append(line);
                errorBuffer.append("\n");
            }
        }

        if (errorBuffer.length() != 0) {
            compileResultDto.setIsAnswer(false);
            compileResultDto.setErrorMessage(errorBuffer.toString());
            return compileResultDto;
        }

        Process execProcess = runtime.exec(execCommands);
        execProcess.waitFor();
        try (BufferedReader execInput = new BufferedReader(new InputStreamReader(execProcess.getInputStream()));
                BufferedReader execError = new BufferedReader(new InputStreamReader(execProcess.getErrorStream()));) {
            String line = "";
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
                    timeElapsed = (double) timeOutInMiliseconds;
                    break;
                } else {
                    errorBuffer.append(line);
                    errorBuffer.append("\n");
                }
            }
            while ((line = execInput.readLine()) != null) {
                if (line.equals("$answer")) {
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

            compileResultDto.setActual(actual);
            compileResultDto.setErrorMessage(errorMessage);
            compileResultDto.setExpected(expected);
            compileResultDto.setIsAnswer(isAnswer);
            compileResultDto.setIsTimeOut(isTimeOut);
            compileResultDto.setOutputMessage(outputMessage);
            compileResultDto.setTimeElapsed(timeElapsed);
            compileFile.deleteOnExit();
            execFile.deleteOnExit();
            return compileResultDto;
        }
    }

}