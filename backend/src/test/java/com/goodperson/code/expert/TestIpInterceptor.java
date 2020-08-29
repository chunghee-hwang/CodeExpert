package com.goodperson.code.expert;

import static org.junit.jupiter.api.Assertions.assertNotEquals;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;

import lombok.ToString;

@SpringBootTest
public class TestIpInterceptor{

    @ToString
    private class IpInfo {
        private String ip;
        private String countryCode;
        private String countryName;
    }
    
    @Test
    public void getIpInfo(){
        String ip = "116.127.197.34";
        IpInfo ipInfo = requestIpInfo(ip);
        assertNotEquals(ipInfo,"");
    }

    private IpInfo requestIpInfo(String ip) {
        final String geopluginPrefix = "http://www.geoplugin.net/xml.gp?ip=";
        final String userAgent = "Mozilla/5.0";
        final String countryNameXmlTagRegex = "<geoplugin_countryName>((\\w|\\W)+)</geoplugin_countryName>";
        final String countryCodeXmlTagRegex = "<geoplugin_countryCode>((\\w|\\W)+)</geoplugin_countryCode>";
        IpInfo ipInfo = new IpInfo();
        ipInfo.ip = ip;
        try{
            URL url = new URL(geopluginPrefix + ip);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setRequestMethod("GET");
            connection.setRequestProperty("User-Agent", userAgent);
            int responseCode = connection.getResponseCode();
            StringBuffer response = new StringBuffer();
            if(responseCode == HttpStatus.OK.value())
            {
                try(BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(connection.getInputStream())))
                {
                    String line;
                    while((line = bufferedReader.readLine())!=null){
                        response.append(line);
                    }
                }
                Matcher countryNameMatcher = Pattern.compile(countryNameXmlTagRegex).matcher(response);
                Matcher countryCodeMatcher = Pattern.compile(countryCodeXmlTagRegex).matcher(response);
                if(countryNameMatcher.find()){
                    ipInfo.countryName = countryNameMatcher.group(1);
                }
                if(countryCodeMatcher.find()){
                    ipInfo.countryCode = countryCodeMatcher.group(1);
                }
            }
        }
        catch(MalformedURLException me){
            me.printStackTrace();
            return null;
        }catch(Exception e){
            e.printStackTrace();
            return null;
        }
        return ipInfo;
    }
}