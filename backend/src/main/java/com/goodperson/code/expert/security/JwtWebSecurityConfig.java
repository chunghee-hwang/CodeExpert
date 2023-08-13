package com.goodperson.code.expert.security;

import com.goodperson.code.expert.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

// Customizes Spring Security for JWT Authentication Needs by extending WebSecurityConfigurerAdapter
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class JwtWebSecurityConfig {
    @Autowired
    private JwtUnAuthorizedResponseAuthenticationEntryPoint jwtUnAuthorizedResponseAuthenticationEntryPoint;

    @Autowired
    private AccountService accountService;

    @Autowired
    private JwtTokenAuthorizationOncePerRequestFilter jwtTokenAuthorizationOncePerRequestFilter;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${jwt.get.token.url}")
    private String authenticationPath;

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(accountService).passwordEncoder(passwordEncoder);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf(AbstractHttpConfigurer::disable).exceptionHandling(Customizer.withDefaults());

        httpSecurity.sessionManagement(httpSecuritySessionManagementConfigurer -> httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        httpSecurity.authorizeHttpRequests(authorizationManagerRequestMatcherRegistry -> authorizationManagerRequestMatcherRegistry.anyRequest().authenticated());

        httpSecurity.addFilterBefore(jwtTokenAuthorizationOncePerRequestFilter,
                UsernamePasswordAuthenticationFilter.class);

        httpSecurity.headers(httpSecurityHeadersConfigurer -> httpSecurityHeadersConfigurer.frameOptions(frameOptionsConfig -> frameOptionsConfig.sameOrigin().cacheControl(Customizer.withDefaults())));
        return httpSecurity.build();
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return jwtUnAuthorizedResponseAuthenticationEntryPoint;
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (webSecurity -> {
            final String[] accessablePostUrls = new String[]{
                    authenticationPath,"/logoutAccount","/signup"
            };
            final String[] accessableGetUrls = new String[]{
                    "/static/**", "/", "/logo.svg", "/favicon.ico", "/manifest.json"
            };
            webSecurity.ignoring().anyRequest();
//            webSecurity.ignoring().requestMatchers(HttpMethod.POST, accessablePostUrls)
//                    .requestMatchers(HttpMethod.GET, accessableGetUrls)
//                    .requestMatchers(HttpMethod.OPTIONS, "/**");
        });
    }


}