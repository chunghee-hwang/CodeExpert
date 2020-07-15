package com.goodperson.code.expert;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.Optional;

import com.goodperson.code.expert.model.Problem;
import com.goodperson.code.expert.model.ProblemLevel;
import com.goodperson.code.expert.model.ProblemType;
import com.goodperson.code.expert.model.User;
import com.goodperson.code.expert.repository.ProblemLevelRepository;
import com.goodperson.code.expert.repository.ProblemRepository;
import com.goodperson.code.expert.repository.ProblemTypeRepository;
import com.goodperson.code.expert.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class RepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProblemTypeRepository problemTypeRepository;

    @Autowired
    private ProblemLevelRepository problemLevelRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Test
    public void testUserRepository() {

    }

    @Test
    public void testProblemRepository() {

        addUserSample();
        addProblemTypeAndLevelSample();

        ProblemLevel level = new ProblemLevel();
        level.setId(2L);
        User creator = new User();
        creator.setId(2L);
        ProblemType type = new ProblemType();
        type.setId(1L);

        Problem problem = new Problem();
        problem.setTitle("정렬하기");
        problem.setContent("설명");
        problem.setLimitExplain("제한 사항");
        problem.setTimeLimit(500);
        problem.setMemoryLimit(256);
        problem.setProblemLevel(level);
        problem.setProblemType(type);
        problem.setCreator(creator);

        problemRepository.save(problem);

        Optional<Problem> result = problemRepository.findById(1L);
        if (result.isPresent()) {
            Problem resultProblem = result.get();
            assertNotNull(resultProblem);
        }
    }

    private void addUserSample() {
        User user = new User();
        user.setEmail("hch0821@naver.com");
        // 한글 escape
        String nickname = "가나다라마바사아자차카타파하호";
        user.setNickname(nickname);
        user.setPassword("1234");
        user.setRole("USER");
        userRepository.save(user);

        nickname = userRepository.findByEmail("hch0821@naver.com").getNickname();

        User user2 = new User();
        user2.setEmail("korean@naver.com");
        user2.setNickname("호호호");
        user2.setPassword("3333");
        user2.setRole("USER");
        userRepository.save(user2);
    }

    private void addProblemTypeAndLevelSample() {
        ProblemLevel level = new ProblemLevel();
        level.setName(1);
        ProblemLevel level2 = new ProblemLevel();
        level2.setName(2);
        ProblemLevel level3 = new ProblemLevel();
        level3.setName(3);
        ProblemLevel level4 = new ProblemLevel();
        level4.setName(4);
        problemLevelRepository.save(level);
        problemLevelRepository.save(level2);
        problemLevelRepository.save(level3);
        problemLevelRepository.save(level4);

        ProblemType type = new ProblemType();
        type.setName("동적 계획법");
        ProblemType type2 = new ProblemType();
        type2.setName("해시");
        ProblemType type3 = new ProblemType();
        type3.setName("정렬");
        ProblemType type4 = new ProblemType();
        type4.setName("완전 탐색");
        ProblemType type5 = new ProblemType();
        type5.setName("탐욕법");

        problemTypeRepository.save(type);
        problemTypeRepository.save(type2);
        problemTypeRepository.save(type3);
        problemTypeRepository.save(type4);
        problemTypeRepository.save(type5);
    }
}