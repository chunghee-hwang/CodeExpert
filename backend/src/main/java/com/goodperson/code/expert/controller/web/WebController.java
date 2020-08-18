package com.goodperson.code.expert.controller.web;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController implements ErrorController {
    // 백엔드에서 React.js 라우터에 있는 주소로 주소를 임의 변경하면,
    // 매핑되는 주소가 없으므로 404 오류가 생긴다.
    // 이를 방지하기 위해 에러가 발생하면 프론트엔드에서 작성한 frontend/src/index.html을 전송한다.
    @GetMapping({ "/", "/error" })
    public String index() {
        return "index";
    }

    /*400에러 발생 시 getErrorPath() 호출*/
    @Override
    public String getErrorPath() {
        return "/error";
    }
}