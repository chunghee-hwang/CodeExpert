package com.goodperson.code.expert;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.goodperson.code.expert.model.DataType;
import com.goodperson.code.expert.model.Problem;
import com.goodperson.code.expert.model.ProblemLevel;
import com.goodperson.code.expert.model.ProblemParameter;
import com.goodperson.code.expert.model.ProblemParameterValue;
import com.goodperson.code.expert.model.ProblemReturn;
import com.goodperson.code.expert.model.ProblemTestcase;
import com.goodperson.code.expert.model.ProblemType;
import com.goodperson.code.expert.model.User;
import com.goodperson.code.expert.repository.DataTypeRepository;
import com.goodperson.code.expert.repository.ProblemLevelRepository;
import com.goodperson.code.expert.repository.ProblemParamterRepository;
import com.goodperson.code.expert.repository.ProblemParamterValueRepository;
import com.goodperson.code.expert.repository.ProblemRepository;
import com.goodperson.code.expert.repository.ProblemReturnRepository;
import com.goodperson.code.expert.repository.ProblemTestcaseRepository;
import com.goodperson.code.expert.repository.ProblemTypeRepository;
import com.goodperson.code.expert.repository.UserRepository;

import com.goodperson.code.expert.requests.InputOutputTableRequest;
import com.goodperson.code.expert.requests.ParameterRequest;
import com.goodperson.code.expert.requests.RegisterOrUpdateProblemRequest;
import com.goodperson.code.expert.requests.ReturnRequest;
import com.goodperson.code.expert.requests.TestcaseRequest;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ProblemApiTest {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProblemTypeRepository problemTypeRepository;

    @Autowired
    private ProblemParamterRepository problemParamterRepository;

    @Autowired
    private ProblemReturnRepository problemReturnRepository;

    @Autowired
    private ProblemParamterValueRepository problemParamterValueRepository;

    @Autowired
    private ProblemTestcaseRepository problemTestcaseRepository;

    @Autowired
    private DataTypeRepository dataTypeRepository;

    @Autowired
    private ProblemLevelRepository problemLevelRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @BeforeEach()
    private void addUserSample() {
        User user = new User();
        user.setEmail("hch0821@naver.com");
        // 한글 escape
        String nickname = "가나다라마바사아자차카타파하호";
        user.setNickname(nickname);
        user.setPassword("1234");
        user.setRole("USER");
        userRepository.save(user);

        User user2 = new User();
        user2.setEmail("korean@naver.com");
        user2.setNickname("호호호");
        user2.setPassword("3333");
        user2.setRole("USER");
        userRepository.save(user2);

    }

    @BeforeEach()
    private void addProblemTypeAndLevelAndDataTypeSample() {
        final ProblemLevel[] problemLevels = new ProblemLevel[] { new ProblemLevel(1), new ProblemLevel(2),
                new ProblemLevel(3), new ProblemLevel(4) };

        final ProblemType[] problemTypes = new ProblemType[] { new ProblemType("동적 계획법(Dynamic Programming)"),
                new ProblemType("해시"), new ProblemType("정렬"), new ProblemType("완전 탐색"), new ProblemType("탐욕법"),
                new ProblemType("힙(Heap)"), new ProblemType("스택/큐"), new ProblemType("깊이/너비 우선탐색(DFS/BFS)"),
                new ProblemType("이분 탐색"), new ProblemType("그래프"), new ProblemType("기타") };

        final DataType[] dataTypes = new DataType[] { new DataType("integer"), new DataType("integer_array"),
                new DataType("integer_2d_array"), new DataType("long"), new DataType("long_array"),
                new DataType("long_2d_array"), new DataType("double"), new DataType("double_array"),
                new DataType("double_2d_array"), new DataType("boolean"), new DataType("boolean_array"),
                new DataType("string"), new DataType("string_array") };
        problemLevelRepository.saveAll(Stream.of(problemLevels).collect(Collectors.toList()));
        problemTypeRepository.saveAll(Stream.of(problemTypes).collect(Collectors.toList()));
        dataTypeRepository.saveAll(Stream.of(dataTypes).collect(Collectors.toList()));

    }

    @Test
    public void testGetProblemMetaData() {
        List<ProblemType> problemTypes = problemTypeRepository.findAll();
        List<ProblemLevel> problemLevels = problemLevelRepository.findAll();
        System.out.println(problemTypes);
        System.out.println(problemLevels);
        assertTrue(problemTypes.size() > 0);
        assertTrue(problemLevels.size() > 0);
    }

    @BeforeEach
    @Test
    public void registerOrUpdateProblem() {
        RegisterOrUpdateProblemRequest request = createRegisterOrUpdateProblemRequest();

        // 로그인되어있는 유저 정보
        User authenticatedUser = userRepository.findById(1L).get();

        ProblemType type = new ProblemType();
        type.setId(1L);

        Problem problem = new Problem();
        problem.setId(request.getProblemId());
        problem.setTitle(request.getProblemTitle());
        problem.setContent(request.getProblemContent());
        problem.setLimitExplain(request.getLimitExplain());
        problem.setTimeLimit(request.getTimeLimit());
        problem.setMemoryLimit(request.getMemoryLimit());
        ProblemLevel problemLevel = new ProblemLevel();
        problemLevel.setId(request.getProblemLevelId());
        problem.setProblemLevel(problemLevel);
        ProblemType problemType = new ProblemType();
        problemType.setId(request.getProblemTypeId());
        problem.setProblemType(problemType);
        problem.setCreator(authenticatedUser);

        problemRepository.save(problem);

        InputOutputTableRequest answerTable = request.getAnswerTable();
        InputOutputTableRequest exampleTable = request.getExampleTable();
        addParamterAndReturnAndTestcaseInfoFromTableInfo(problem, answerTable, 'a');
        addParamterAndReturnAndTestcaseInfoFromTableInfo(problem, exampleTable, 'e');

        Optional<Problem> result = problemRepository.findById(1L);
        if (result.isPresent()) {
            Problem resultProblem = result.get();
            assertNotNull(resultProblem);
        }
    }

    private void addParamterAndReturnAndTestcaseInfoFromTableInfo(Problem problem, InputOutputTableRequest table,
            char answerOrExample) {
        List<ParameterRequest> params = table.getParams();

        for (ParameterRequest parameterRequest : params) {
            ProblemParameter problemParameter = new ProblemParameter();
            problemParameter.setAnswerOrExample(answerOrExample);
            DataType dataType = parameterRequest.getDataType();
            problemParameter.setDataType(dataType);
            problemParameter.setName(parameterRequest.getName());
            problemParameter.setProblem(problem);
            problemParamterRepository.save(problemParameter);
        }

        ReturnRequest returnRequest = table.getReturns();
        ProblemReturn problemReturn = new ProblemReturn();
        problemReturn.setAnswerOrExample(answerOrExample);
        problemReturn.setDataType(returnRequest.getDataType());
        problemReturn.setProblem(problem);
        problemReturnRepository.save(problemReturn);

        List<TestcaseRequest> testcases = table.getTestcases();
        for (TestcaseRequest testcase : testcases) {
            ProblemTestcase problemTestcase = new ProblemTestcase();
            problemTestcase.setAnswerOrExample(answerOrExample);
            problemTestcase.setReturnValue(testcase.getReturns());
            problemTestcase.setProblem(problem);
            problemTestcaseRepository.save(problemTestcase);
            for (String param : testcase.getParams()) {
                ProblemParameterValue problemParameterValue = new ProblemParameterValue();
                problemParameterValue.setValue(param);
                problemParameterValue.setProblemTestcase(problemTestcase);
                problemParamterValueRepository.save(problemParameterValue);
            }

        }
    }

    private RegisterOrUpdateProblemRequest createRegisterOrUpdateProblemRequest() {
        RegisterOrUpdateProblemRequest request = new RegisterOrUpdateProblemRequest();
        request.setProblemId(1L);
        request.setProblemTitle("더하기");
        request.setProblemTypeId(2L);
        request.setLimitExplain("제한 사항");
        request.setMemoryLimit(256);
        request.setProblemLevelId(1L);
        request.setTimeLimit(100);
        request.setProblemContent("문제 설명");
        InputOutputTableRequest table = new InputOutputTableRequest();
        ParameterRequest param1 = new ParameterRequest();

        DataType dataType = new DataType();
        dataType.setId(1L);
        dataType.setName("integer");
        param1.setDataType(dataType);
        param1.setName("param1");
        List<ParameterRequest> params = new ArrayList<>();
        params.add(param1);
        table.setParams(params);

        ReturnRequest returnRequest = new ReturnRequest();
        returnRequest.setDataType(dataType);
        table.setReturns(returnRequest);

        TestcaseRequest testcaseRequest = new TestcaseRequest();
        List<String> paramValues = new ArrayList<>();
        paramValues.add("5555");
        testcaseRequest.setParams(paramValues);
        testcaseRequest.setReturns("5-5-5-5");
        List<TestcaseRequest> testcaseRequests = new ArrayList<>();
        testcaseRequests.add(testcaseRequest);
        table.setTestcases(testcaseRequests);

        request.setAnswerTable(table);
        request.setExampleTable(table);
        return request;
    }

}