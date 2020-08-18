package com.goodperson.code.expert.utils.validation;

import java.util.Arrays;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

@Component
public class CodeValidation {
    // java 악용 가능 코드 목록
    // https://stackoverflow.com/a/4351516
    private final String[] javaExploitableCodes = { "java.lang.ClassLoader", "java.net.URLClassLoader",
            "java.beans.Instrospector", "java.io.File", "java.io.FileInputStream", "java.io.FileOutputStream",
            "java.io.FileReader", "java.io.FileWriter", "java.io.RandomAccessFile", "System.setProperty",
            "System.getProperties", "System.getProperty", "System.load", "System.loadLibrary", "Runtime.exec",
            "Process", "ProcessBuilder", "java.awt.Robot", "java.lang.Class", "java.lang.reflection",
            "javax.script.ScriptEngine" };

    // cpp 악용 가능 코드 목록
    private final String[] cppExploitableCodes = { "fstream", "ifstream", "ofstream", "glob.h", "system", "FILE",
            "kill", "fork", "sys/types.h", "signal.h" };

    // python3 악용 가능 코드 목록
    // https://stackoverflow.com/a/4272295
    private final String[] python3ExploitableCodes = { "open", "eval", "exec", "execFile", "__import__", "os.system",
            "os.spawn", "os.popen", "popen2.", "commands.", "tarfile", "zipfile", "urllib2", "socket", "pickle",
            "shelve", "subprocess", "os.fork", "os.kill", "getattr", "setattr", "delattr", "sys.argv", "codeExpertAnswerPython",
            "codeExpertParametersPython" };



    // 제출된 코드에 악용 가능 코드가 포함되어있나 확인하는 메소드
    private boolean isExploitableCode(String code, String languageName) {
        switch (languageName) {
            case "cpp":
                return Arrays.stream(cppExploitableCodes).anyMatch(
                        cppExploitableCode -> Pattern.compile("\\b" + cppExploitableCode + "\\b").matcher(code).find());
            case "java":
                return Arrays.stream(javaExploitableCodes).anyMatch(javaExploitableCode -> Pattern
                        .compile("\\b" + javaExploitableCode + "\\b").matcher(code).find());
            case "python3":
                return Arrays.stream(python3ExploitableCodes).anyMatch(python3ExploitableCode -> Pattern
                        .compile("\\b" + python3ExploitableCode + "\\b").matcher(code).find());
            default:
                return true;
        }
    }

    // 제출된 코드 유효한지 검사
    public void validateSubmitProblemCode(String submittedCode, String languageName) throws Exception {
        if(StringUtils.isBlank(submittedCode) || StringUtils.isBlank(languageName)){
            throw new Exception("The required fields are empty.");        
        }
        if(isExploitableCode(submittedCode, languageName)){
            throw new Exception("The code is exploitable.");        
        }
    }

}