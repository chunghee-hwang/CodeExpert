package com.goodperson.code.expert.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// Customizes Spring Security for JWT Authentication Needs by extending WebSecurityConfigurerAdapter
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class JwtWebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private JwtUnAuthorizedResponseAuthenticationEntryPoint jwtUnAuthorizedResponseAuthenticationEntryPoint;

    @Autowired
    private UserDetailsService accountService;

    @Autowired
    private JwtTokenAuthorizationOncePerRequestFilter jwtTokenAuthorizationOncePerRequestFilter;

    @Value("${jwt.get.token.url}")
    private String authenticationPath;

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(accountService).passwordEncoder(passwordEncoderBean());
    }

    @Bean
    public PasswordEncoder passwordEncoderBean() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf().disable().exceptionHandling()
                .authenticationEntryPoint(jwtUnAuthorizedResponseAuthenticationEntryPoint).and().sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().authorizeRequests().anyRequest()
                .authenticated();

        httpSecurity.addFilterBefore(jwtTokenAuthorizationOncePerRequestFilter,
                UsernamePasswordAuthenticationFilter.class);

        httpSecurity.headers().frameOptions().sameOrigin() // H2 Console Needs this setting
                .cacheControl(); // disable caching
    }

    @Override
    public void configure(WebSecurity webSecurity) throws Exception {
        final String[] accessablePostUrls = new String[]{
            authenticationPath,"/logoutAccount","/signup"
        };
        final String[] accessableGetUrls = new String[]{
            "/static/**", "/", "/logo.svg", "/favicon.ico", "/manifest.json"
        };
        webSecurity.ignoring()
        .antMatchers(HttpMethod.POST, accessablePostUrls)
        .antMatchers(HttpMethod.GET, accessableGetUrls)
        .antMatchers(HttpMethod.OPTIONS, "/**");
    }
}