
package com.goodperson.code.expert.filter;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;

import lombok.extern.slf4j.Slf4j;
/**
 * 한국을 제외한 모든 국가 차단하는 필터
 */
@Slf4j
@WebFilter(urlPatterns = "/*")
class IpFilter implements Filter{
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
        boolean allowIpPassed = true;
        String countryCode = null;
        final String koreaCountryCode = "KR";
        String userIp = request.getRemoteAddr();
        if (!userIp.equals("127.0.0.1")) {
            countryCode = requestCountryCodeFromIp(userIp);
            if (countryCode == null || !countryCode.equals(koreaCountryCode)) {
                allowIpPassed = false;
            }
        }
        log.info("The IP {}(countryCode {}) allowed? {}", request.getRemoteAddr(), countryCode, allowIpPassed);
        if(!allowIpPassed){
            res.sendError(HttpStatus.BAD_REQUEST.value());
        }
		chain.doFilter(req, res);
    }

    private String requestCountryCodeFromIp(String ip) {
        String countryCode = null;
        final String geopluginPrefix = "http://www.geoplugin.net/xml.gp?ip=";
        final String userAgent = "Mozilla/5.0";
        final String countryCodeXmlTagRegex = "<geoplugin_countryCode>((\\w|\\W)+)</geoplugin_countryCode>";
        try {
            URL url = new URL(geopluginPrefix + ip);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setRequestMethod("GET");
            connection.setRequestProperty("User-Agent", userAgent);
            int responseCode = connection.getResponseCode();
            StringBuffer response = new StringBuffer();
            if (responseCode == HttpStatus.OK.value()) {
                try (BufferedReader bufferedReader = new BufferedReader(
                        new InputStreamReader(connection.getInputStream()))) {
                    String line;
                    while ((line = bufferedReader.readLine()) != null) {
                        response.append(line);
                    }
                }
                Matcher countryCodeMatcher = Pattern.compile(countryCodeXmlTagRegex).matcher(response);
                if (countryCodeMatcher.find()) {
                    countryCode = countryCodeMatcher.group(1);
                }
            }
        } catch (MalformedURLException me) {
            log.error(me.getMessage());
            return null;
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
        return countryCode;
    }
}
   

    