package com.goodperson.code.expert.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordEncodingConfiguration {
    @Bean
    public PasswordEncoder passwordEncoderBean() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

}
