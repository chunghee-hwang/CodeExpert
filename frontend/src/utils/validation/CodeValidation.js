import languages, { languageNames } from "constants/Languages";

export const idRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
export const passwordRegex = /^.*(?=^.{8,30}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/; //특수문자 / 문자 / 숫자 포함 형태의 8~30자리 이내의 암호 정규식
export const nicknameRegex = /^[a-zA-Z가-힣0-9|\s]{2,15}$/

// 자료형 정규식
export const dataTypeRegexs = {
    integer: /^[+-]?\d+$/,
    integerArray: /^\[([+-]?\d+(,)?(\s)?)*\]$/,
    integer2dArray: /^\[(\[([+-]?\d+(,)?(\s)?)*\](,)?(\s)?)*\]$/,
    long: /^[+-]?\d+$/,
    longArray: /^\[([+-]?\d+(,)?(\s)?)*\]$/,
    long2dArray: /^\[(\[([+-]?\d+(,)?(\s)?)*\](,)?(\s)?)*\]$/,
    double: /^[+-]?\d+(.)?(\d+)?$/,
    doubleArray: /^\[([+-]?\d+(.)?(\d+)?(,)?(\s)?)*\]$/,
    double2dArray: /^\[(\[([+-]?\d+(.)?(\d+)?(,)?(\s)?)*\](,)?(\s)?)*\]$/,
    boolean: /^(true|false)$/,
    booleanArray: /^\[((true|false)(,)?(\s)?)*\]$/,
    string: /^"[^"]*"$/,
    stringArray: /^\[("[^"]*"(,)?(\s)?)*\]$/,
}

// URL 정규식
export const integerParamRegex = /^\d+$/;

// 파라미터 이름 정규식 (변수명 규칙)
export const valueNameRegex = /^[^0-9][\w]+$/


const javaKeywords =
    ["abstract", "assert", "boolean",
        "break", "byte", "case", "catch", "char", "class", "const",
        "continue", "default", "do", "double", "else", "extends", "false",
        "final", "finally", "float", "for", "goto", "if", "implements",
        "import", "instanceof", "int", "interface", "long", "native",
        "new", "null", "package", "private", "protected", "public",
        "return", "short", "static", "strictfp", "super", "switch",
        "synchronized", "this", "throw", "throws", "transient", "true",
        "try", "void", "volatile", "while"];

const python3Keywords = ['False', 'None', 'True', 'and', 'as', 'assert',
    'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif',
    'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import',
    'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass',
    'raise', 'return', 'try', 'while', 'with', 'yield'];

const cppKeywords = ['asm', 'else', 'new', 'this',
    'auto', 'enum', 'operator', 'throw',
    'bool', 'explicit', 'private', 'true',
    'break', 'export', 'protected', 'try',
    'case', 'extern', 'public', 'typedef',
    'catch', 'false', 'register', 'typeid',
    'char', 'float', 'reinterpret_cast', 'typename',
    'class', 'for', 'return', 'union',
    'const', 'friend', 'short', 'unsigned',
    'const_cast', 'goto', 'signed', 'using',
    'continue', 'if', 'sizeof', 'virtual',
    'default', 'inline', 'static', 'void',
    'delete', 'int', 'static_cast', 'volatile',
    'do', 'long', 'struct', 'wchar_t',
    'double', 'mutable', 'switch', 'while',
    'dynamic_cast', 'namespace', 'template', 'And', 'bitor', 'not_eq', 'xor',
    'and_eq', 'compl', 'or', 'xor_eq',
    'bitand', 'not', 'or_eq']

// 예약어인지 판단하는 메소드 (모든 언어의 키워드를 검사)
export const isKeyword = (word) => {
    return cppKeywords.indexOf(word) !== -1 || javaKeywords.indexOf(word) !== -1 || python3Keywords.indexOf(word) !== -1;
}


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
    else{
        validation.isValid = true;
    }
    return validation;
}