package com.goodperson.code.expert.service.impl;

import java.util.Optional;

import com.goodperson.code.expert.dto.UserRequestDto;
import com.goodperson.code.expert.dto.UserResponseDto;
import com.goodperson.code.expert.model.User;
import com.goodperson.code.expert.repository.UserRepository;
import com.goodperson.code.expert.service.AccountService;
import com.goodperson.code.expert.utils.validation.AccountValidation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AccountServiceImpl implements AccountService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AccountValidation accountValidation;


    @Override
    public UserResponseDto signUp(UserRequestDto userDto) throws Exception {
        // 이메일과 닉네임 중복 체크
        final String password = userDto.getPassword();
        final String email = userDto.getEmail();
        final String nickname = userDto.getNickname();
        accountValidation.validateSignUp(userDto);
        boolean emailExists = userRepository.existsByEmail(email);
        boolean nicknameExists = userRepository.existsByNickname(nickname);
        if (nicknameExists) {
            throw new Exception("The same nickname already exists");
        }
        if (emailExists) {
            throw new Exception("The same id already exists");
        }
        User user = new User();
        user.setEmail(email);
        user.setNickname(nickname);
        user.setPassword(passwordEncoder.encode(password)); // encode: 암호화하고 다시 복호화하지 않기(단방향 암호화)
        user.setRole("USER");

        userRepository.save(user);
        return convertUserToResponseDto(user);
    }

    @Override
    public UserResponseDto changeNickname(UserRequestDto userDto) throws Exception {
        final String newNickname = userDto.getNewNickname();
        accountValidation.validateChangeNickname(userDto);

        boolean nicknameExists = userRepository.existsByNickname(newNickname);
        if (nicknameExists) {
            throw new Exception("The same nickname already exists");
        }
        User authenticatedUser = getAuthenticatedUser();
        authenticatedUser.setNickname(newNickname);

        userRepository.save(authenticatedUser);
        return convertUserToResponseDto(authenticatedUser);
    }

    @Override
    public UserResponseDto changePassword(UserRequestDto userDto) throws Exception {
        final String password = userDto.getPassword();
        final String newPassword = userDto.getNewPassword();
        accountValidation.validateChangePassword(userDto);
        User authenticatedUser = getAuthenticatedUser();
        // 비밀번호 확인
        if (!passwordEncoder.matches(password, authenticatedUser.getPassword())) {
            throw new Exception("The password is not correct.");
        }
        authenticatedUser.setPassword(passwordEncoder.encode(newPassword));// encode: 클라이언트에서 암호화하고 서버에선 복호화하지 않기(단방향 암호화)
        userRepository.save(authenticatedUser);
        return convertUserToResponseDto(authenticatedUser);
    }

    @Override
    public void deleteAccount() throws Exception {
        User authenticatedUser = getAuthenticatedUser();
        userRepository.delete(authenticatedUser);
        if (userRepository.findById(authenticatedUser.getId()).isPresent()) {
            throw new Exception("An error occured when deleting your account.");
        }
    }

    @Override
    public UserResponseDto convertUserToResponseDto(User user) {
        UserResponseDto userDto = new UserResponseDto();
        userDto.setId(user.getId());
        userDto.setNickname(user.getNickname());
        userDto.setEmail(user.getEmail());
        return userDto;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOptional = userRepository.findByEmail(username);
        if (!userOptional.isPresent()) {

            throw new UsernameNotFoundException(String.format("The user info or password is not correct: '%s'.", username));
        }
        return userOptional.get();
    }

    @Override
    public User getAuthenticatedUser() throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new UsernameNotFoundException("Not authroized.");
        }
        Object principal = authentication.getPrincipal();
        if (principal == null) {
            throw new Exception("You are not authorized");
        }
        User authenticatedUser = (User) principal;
        return authenticatedUser;
    }

}