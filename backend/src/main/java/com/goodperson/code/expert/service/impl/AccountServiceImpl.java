package com.goodperson.code.expert.service.impl;

import java.util.Objects;
import java.util.Optional;

import com.goodperson.code.expert.dto.UserDto;
import com.goodperson.code.expert.model.User;
import com.goodperson.code.expert.repository.UserRepository;
import com.goodperson.code.expert.service.AccountService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccountServiceImpl implements AccountService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDto signUp(String email, String nickname, String password, String passwordCheck) throws Exception {
        // 이메일과 닉네임 중복 체크
        boolean emailExists = userRepository.existsByEmail(email);
        boolean nicknameExists = userRepository.existsByNickname(nickname);
        if (nicknameExists) {
            throw new Exception("The same nickname already exists");
        }
        if (emailExists) {
            throw new Exception("The same id already exists");
        }
        // 비밀번호 비밀번호 확인 일치 체크
        if (!password.equals(passwordCheck)) {
            throw new Exception("The password and password check are not same.");
        }

        User user = new User();
        user.setEmail(email);
        user.setNickname(nickname);
        user.setPassword(password); // encode: 클라이언트에서 암호화하고 서버에선 복호화하지 않기(단방향 암호화)
        user.setRole("USER");

        userRepository.save(user);
        return convertUserToDto(user);
    }

    @Override
    public UserDto changeNickname(User authenticatedUser, String newNickname) throws Exception {
        Objects.requireNonNull(newNickname);

        boolean nicknameExists = userRepository.existsByNickname(newNickname);
        if (nicknameExists) {
            throw new Exception("The same nickname already exists");
        }

        authenticatedUser.setNickname(newNickname);

        userRepository.save(authenticatedUser);
        return convertUserToDto(authenticatedUser);
    }

    @Override
    public UserDto changePassword(User authenticatedUser, String password, String newPassword, String newPasswordCheck)
            throws Exception {
        Objects.requireNonNull(password);
        Objects.requireNonNull(newPassword);
        Objects.requireNonNull(newPasswordCheck);

        // 비밀번호 확인
        if (!password.equals(authenticatedUser.getPassword())) {
            throw new Exception("The password is not correct.");
        }
        // 비밀번호 비밀번호 확인 일치 체크
        if (!newPassword.equals(newPasswordCheck)) {
            throw new Exception("The password and password check are not same.");
        }

        authenticatedUser.setPassword(newPassword);// encode: 클라이언트에서 암호화하고 서버에선 복호화하지 않기(단방향 암호화)
        userRepository.save(authenticatedUser);
        return convertUserToDto(authenticatedUser);
    }

    @Override
    public void deleteAccount(User authenticatedUser) throws Exception {
        userRepository.delete(authenticatedUser);
        if (userRepository.findById(authenticatedUser.getId()).isPresent()) {
            throw new Exception("An error occured when deleting your account.");
        }
    }

    private UserDto convertUserToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setNickname(user.getNickname());
        return userDto;
    }

    @Override
    public UserDto login(String email, String password) throws Exception {
        Optional<User> userOptional = userRepository.findByEmailAndPassword(email, password);
        if (!userOptional.isPresent()) {
            throw new Exception("Your email or password is not correct.");
        }
        return convertUserToDto(userOptional.get());
    }

}