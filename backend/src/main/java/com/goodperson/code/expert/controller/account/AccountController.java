package com.goodperson.code.expert.controller.account;

import java.util.Objects;

import jakarta.servlet.http.HttpServletResponse;

import com.goodperson.code.expert.dto.UserRequestDto;
import com.goodperson.code.expert.dto.UserResponseDto;
import com.goodperson.code.expert.model.User;
import com.goodperson.code.expert.security.AuthenticationException;
import com.goodperson.code.expert.security.JwtTokenRequest;
import com.goodperson.code.expert.security.JwtTokenUtil;
import com.goodperson.code.expert.service.AccountService;
import com.goodperson.code.expert.utils.ErrorResponseManager;
import com.goodperson.code.expert.utils.TokenCookieManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AccountController {
    @Value("${jwt.http.request.header}")
    private String tokenHeader;

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private AccountService accountService;

    @Autowired
    private ErrorResponseManager errorResponseManager;

    @Autowired
    private TokenCookieManager tokenCookieManager;



    // login
    @RequestMapping(value = "${jwt.get.token.url}", method = RequestMethod.POST)
    public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtTokenRequest authenticationRequest,
            HttpServletResponse response) throws AuthenticationException {
        try {
            authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
            final UserDetails userDetails = accountService.loadUserByUsername(authenticationRequest.getUsername());
            final String token = jwtTokenUtil.generateToken(userDetails);
            tokenCookieManager.addTokenToCookie(response, token);
            UserResponseDto userDto = accountService.convertUserToResponseDto((User) userDetails);
            return new ResponseEntity<>(userDto, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(errorResponseManager.makeErrorResponse(e), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/logoutAccount")
    public ResponseEntity<?> logout(HttpServletResponse response) throws Exception {
        tokenCookieManager.deleteTokenFromCookie(response);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody UserRequestDto userRequestDto) throws Exception {
        try {
            UserResponseDto signUpUserDto = accountService.signUp(userRequestDto);
            return new ResponseEntity<>(signUpUserDto, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(errorResponseManager.makeErrorResponse(e), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/changeNickname")
    public ResponseEntity<?> changeNickname(@RequestBody UserRequestDto userRequestDto) throws Exception {
        try {
            UserResponseDto userResponseDto = accountService.changeNickname(userRequestDto);
            return new ResponseEntity<>(userResponseDto, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(errorResponseManager.makeErrorResponse(e), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody UserRequestDto userRequestDto) throws Exception {
        try {
            UserResponseDto userResponseDto = accountService.changePassword(userRequestDto);
            return new ResponseEntity<>(userResponseDto, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(errorResponseManager.makeErrorResponse(e), HttpStatus.BAD_REQUEST);
        }

    }

    @PutMapping("/deleteAccount")
    public ResponseEntity<?> deleteAccount(HttpServletResponse response) throws Exception {
        try {
            accountService.deleteAccount();
            tokenCookieManager.deleteTokenFromCookie(response);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(errorResponseManager.makeErrorResponse(e), HttpStatus.BAD_REQUEST);
        }
    }

    @ExceptionHandler({ AuthenticationException.class })
    public ResponseEntity<String> handleAuthenticationException(AuthenticationException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
    }

    private void authenticate(String username, String password) {
        Objects.requireNonNull(username);
        Objects.requireNonNull(password);
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new AuthenticationException("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new AuthenticationException("The id or password is not correct.", e);
        }
    }
}