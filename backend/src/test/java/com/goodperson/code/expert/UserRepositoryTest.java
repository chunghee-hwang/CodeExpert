package com.goodperson.code.expert;

import static org.junit.jupiter.api.Assertions.assertTrue;

import com.goodperson.code.expert.model.User;
import com.goodperson.code.expert.repository.UserRepository;

import org.apache.commons.text.StringEscapeUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testUserRepository() {
        User user = new User();
        user.setEmail("hch0821@naver.com");

        // 한글 escape
        String nickname = StringEscapeUtils.escapeEcmaScript("가나다라마바사아자차카타파하호");
        user.setNickname(nickname);

        user.setPassword("1234");

        user.setRole("USER");

        userRepository.save(user);

        nickname = userRepository.findByEmail("hch0821@naver.com").getNickname();

        // 한글 unescape
        nickname = StringEscapeUtils.unescapeEcmaScript(nickname);
        assertTrue(nickname.equals("가나다라마바사아자차카타파하호"));
    }
}