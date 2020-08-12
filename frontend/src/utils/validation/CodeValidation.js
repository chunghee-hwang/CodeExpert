import languages, { languageNames } from "constants/Languages";

// java 악용 가능 코드 목록
// https://stackoverflow.com/a/4351516
const javaExploitableCodes = [
    'java.lang.ClassLoader',
'java.net.URLClassLoader',
'java.beans.Instrospector',
'java.io.File',
'java.io.FileInputStream',
'java.io.FileOutputStream',
'java.io.FileReader',
'java.io.FileWriter',
'java.io.RandomAccessFile',
'System.setProperty',
'System.getProperties',
'System.getProperty',
'System.load',
'System.loadLibrary',
'Runtime.exec',
'Process',
'ProcessBuilder',
'java.awt.Robot',
'java.lang.Class',
'java.lang.reflection',
'javax.script.ScriptEngine'
];

// cpp 악용 가능 코드 목록
const cppExploitableCodes = [
    'fstream',
    'ifstream',
    'ofstream',
    'glob.h',
    'system',
    'FILE',
    'kill',
    'fork',
    'sys/types.h',
    'signal.h'
];

// python3 악용 가능 코드 목록
//https://stackoverflow.com/a/4272295
const python3ExploitableCodes=[
    'open',
    'eval',
    'exec',
    'execFile',
    '__import__',
    'os.system',
    'os.spawn',
    'os.popen',
    'popen2.',
    'commands.',
    'tarfile',
    'zipfile',
    'urllib2',
    'socket',
    'pickle',
    'shelve',
    'subprocess',
    'os.fork',
    'os.kill',
    'getattr',
    'setattr',
    'delattr',
]

// 제출된 코드에 악용 가능 코드가 포함되어있나 확인하는 메소드
export const isExploitableCode = (code, languageName)=>{
    switch(languageName){
        case languages.cpp.name:
            return cppExploitableCodes.some(cppExploitableCode=>code.match(new RegExp(`\\b${cppExploitableCode}\\b`)));
        case languages.java.name:
            return javaExploitableCodes.some(javaExploitableCode=>code.match(new RegExp(`\\b${javaExploitableCode}\\b`)));
        case languages.python3.name:
            return python3ExploitableCodes.some(python3ExploitableCode=>code.match(new RegExp(`\\b${python3ExploitableCode}\\b`)));
        default:
            return true;
    }
}

// 제출된 코드 유효한지 검사
export const validateSubmitCode=({code, language})=>{
    let validation = {
        isValid: false,
        failCause: null,
    }
    const languageName = language.name;
    const languageId = language.id;
    if(!code.trim()){
        validation.failCause='코드는 필수 기재사항입니다.';
    }
    else if(!languageName||!languageId || languageNames.indexOf(languageName)===-1){
        validation.failCause='코드 언어 정보가 유효하지 않습니다.';
    }
    else if(isExploitableCode(code, languageName)){
        validation.failCause='보안에 위반되는 키워드(시스템 관련)가 있습니다.';
    }
    else
    {
        validation.isValid = true;
    }
    return validation;
}