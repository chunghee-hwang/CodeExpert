package com.goodperson.code.expert.utils;

import java.net.URLConnection;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

@Component
public class FileUtils {

    public String getContentTypeFromFileName(String fileName) {
        return URLConnection.guessContentTypeFromName(fileName);
    }

    public String getFileExtension(String fileName) throws Exception {
        int idx = fileName.lastIndexOf('.');
        if (idx == -1)
            throw new Exception("The file info is not correct.");
        return fileName.substring(idx, fileName.length());
    }

    public String getFileNameExceptExtension(String fileName) throws Exception {
        int idx = fileName.lastIndexOf('.');
        if (idx == -1)
            throw new Exception("The file info is not correct.");
        return fileName.substring(0, idx);
    }

    // 파일명이 중복되어 db에 저장되지 않도록 유니크한 파일명을 만드는 메소드
    public String getUniqueSaveFileName(String sameFileName) throws Exception {
        final String prefix = getFileNameExceptExtension(sameFileName);
        final String suffix = getFileExtension(sameFileName);
        Matcher matcher = Pattern.compile("\\d+$").matcher(prefix);
        String uniqueName = "";
        if (matcher.find()) {
            uniqueName = prefix.substring(0, matcher.start()) + (Integer.parseInt(matcher.group()) + 1) + suffix;
        } else {
            uniqueName = prefix + "2" + suffix;
        }
        return uniqueName;

    }
}