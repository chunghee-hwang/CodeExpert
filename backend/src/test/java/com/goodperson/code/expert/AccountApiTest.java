package com.goodperson.code.expert;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Objects;
import java.util.Optional;

import com.goodperson.code.expert.model.User;
import com.goodperson.code.expert.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class AccountApiTest {

    @Autowired
    private UserRepository userRepository;

    // @Bean
    // public PasswordEncoder passwordEncoder() {
    // return new BCryptPasswordEncoder();
    // }

    @BeforeEach()
    private void addUserSample() {
        // User user = new User();
        // user.setEmail("hch0821@naver.com");
        // String nickname = "가나다라마바사아자차카타파하호";
        // user.setNickname(nickname);
        // // user.setPassword(passwordEncoder().encode("1234"));
        // user.setPassword("1234");
        // user.setRole("USER");
        // userRepository.save(user);

        // User user2 = new User();
        // user2.setEmail("korean@naver.com");
        // user2.setNickname("호호호");
        // // user2.setPassword(passwordEncoder().encode("3333"));
        // user2.setPassword("3333");
        // user2.setRole("USER");
        // userRepository.save(user2);

    }

    @Test
    public void testChangeNickname() {
        final String newNickname = "히히";

        Objects.requireNonNull(newNickname);

        // 로그인되어있는 유저 정보
        User authenticatedUser = userRepository.findById(1L).get();

        assertNotEquals(newNickname, authenticatedUser.getNickname());

        authenticatedUser.setNickname(newNickname);

        userRepository.save(authenticatedUser);
    }

    @Test
    public void testChangePassword() {
        final String password = "1234";
        final String newPassword = "1313";
        final String newPasswordCheck = "1313";

        Objects.requireNonNull(password);
        Objects.requireNonNull(newPassword);
        Objects.requireNonNull(newPasswordCheck);

        // 로그인되어있는 유저 정보
        User authenticatedUser = userRepository.findById(1L).get();

        // 비밀번호 확인
        // assertTrue(passwordEncoder().matches(password,
        // authenticatedUser.getPassword()));
        assertTrue(newPassword.equals(newPasswordCheck));

        // authenticatedUser.setPassword(passwordEncoder().encode(newPassword));
        userRepository.save(authenticatedUser);
    }

    @Test
    public void testDeleteAccount() {
        // 로그인되어있는 유저 정보
        User authenticatedUser = userRepository.findById(1L).get();

        userRepository.delete(authenticatedUser);
        assertTrue(!userRepository.findById(authenticatedUser.getId()).isPresent());
    }

    @Test
    public void testLogin() {
        final String email = "korean@naver.com";
        final String password = "3333";
        // Optional<User> user = userRepository.findByEmailAndPassword(email,
        // passwordEncoder().encode(password));
        Optional<User> user = userRepository.findByEmailAndPassword(email, password);
        assertNotNull(user.isPresent());
    }

    @Test
    public void testSignUp() {
        final String email = "ppp@naver.com";
        final String nickname = "poop";
        final String password = "1511";
        final String passwordCheck = "1511";

        // 이메일과 닉네임 중복 체크
        boolean emailExists = userRepository.existsByEmail(email);
        boolean nicknameExists = userRepository.existsByNickname(nickname);
        assertTrue(!nicknameExists);
        assertTrue(!emailExists);

        // 비밀번호 비밀번호 확인 일치 체크
        assertTrue(password.equals(passwordCheck));

        User user = new User();
        user.setEmail(email);
        user.setNickname(nickname);
        // user.setPassword(passwordEncoder().encode(password));
        user.setRole("USER");

        userRepository.save(user);
    }

}