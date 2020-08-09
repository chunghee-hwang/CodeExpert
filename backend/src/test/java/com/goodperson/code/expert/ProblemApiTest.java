package com.goodperson.code.expert;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.goodperson.code.expert.dto.CodeDto;
import com.goodperson.code.expert.dto.CompileErrorDto;
import com.goodperson.code.expert.dto.DataTypeDto;
import com.goodperson.code.expert.dto.InputOutputTableDto;
import com.goodperson.code.expert.dto.LanguageDto;
import com.goodperson.code.expert.dto.MarkResultDto;
import com.goodperson.code.expert.dto.ParameterDto;
import com.goodperson.code.expert.dto.ProblemDetailDto;
import com.goodperson.code.expert.dto.ProblemDto;
import com.goodperson.code.expert.dto.ProblemLevelDto;
import com.goodperson.code.expert.dto.ProblemTypeDto;
import com.goodperson.code.expert.dto.RegisterOrUpdateProblemRequestDto;
import com.goodperson.code.expert.dto.ReturnDto;
import com.goodperson.code.expert.dto.TestcaseDto;
import com.goodperson.code.expert.dto.UserRequestDto;
import com.goodperson.code.expert.model.Code;
import com.goodperson.code.expert.model.DataType;
import com.goodperson.code.expert.model.Language;
import com.goodperson.code.expert.model.Problem;
import com.goodperson.code.expert.model.ProblemLevel;
import com.goodperson.code.expert.model.ProblemParameter;
import com.goodperson.code.expert.model.ProblemParameterValue;
import com.goodperson.code.expert.model.ProblemReturn;
import com.goodperson.code.expert.model.ProblemTestcase;
import com.goodperson.code.expert.model.ProblemType;
import com.goodperson.code.expert.model.Solution;
import com.goodperson.code.expert.model.User;
import com.goodperson.code.expert.repository.CodeRepository;
import com.goodperson.code.expert.repository.DataTypeRepository;
import com.goodperson.code.expert.repository.LanguageRepository;
import com.goodperson.code.expert.repository.ProblemLevelRepository;
import com.goodperson.code.expert.repository.ProblemParameterValueRepository;
import com.goodperson.code.expert.repository.ProblemParamterRepository;
import com.goodperson.code.expert.repository.ProblemRepository;
import com.goodperson.code.expert.repository.ProblemReturnRepository;
import com.goodperson.code.expert.repository.ProblemTestcaseRepository;
import com.goodperson.code.expert.repository.ProblemTypeRepository;
import com.goodperson.code.expert.repository.SolutionRepository;
import com.goodperson.code.expert.repository.UserRepository;
import com.goodperson.code.expert.utils.CodeGenerateManager;
import com.goodperson.code.expert.utils.CompileManager;
import com.goodperson.code.expert.utils.CompileOption;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;

@SpringBootTest
public class ProblemApiTest {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProblemTypeRepository problemTypeRepository;

    @Autowired
    private ProblemParamterRepository problemParameterRepository;

    @Autowired
    private ProblemReturnRepository problemReturnRepository;

    @Autowired
    private ProblemParameterValueRepository problemParameterValueRepository;

    @Autowired
    private ProblemTestcaseRepository problemTestcaseRepository;

    @Autowired
    private DataTypeRepository dataTypeRepository;

    @Autowired
    private LanguageRepository languageRepository;

    @Autowired
    private ProblemLevelRepository problemLevelRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private CodeRepository codeRepository;

    @Autowired
    private SolutionRepository solutionRepository;

    @Autowired
    private CodeGenerateManager codeGenerateManager;

    @Autowired
    private CompileManager compileManager;

    @BeforeEach
    public void executeBeforeTests() throws Exception {
        addUserSample();
        addProblemTypeAndLevelAndDataTypeAndLanguageSample();
        registerOrUpdateProblemSample(1L, 1L, false);
        registerOrUpdateProblemSample(2L, 1L, false);
    }

    private void registerOrUpdateProblemSample(Long problemId, Long creatorId, boolean isUpdate) throws Exception {
        RegisterOrUpdateProblemRequestDto request = createRegisterOrUpdateProblemRequestDtoSample(problemId);
        // 로그인되어있는 유저 정보
        User authenticatedUser = userRepository.findById(creatorId).get();

        if (isUpdate) {
            // 문제를 수정할 땐 문제를 만든 사람이 일치하는지 확인한다.
            boolean isCreator = problemRepository.existsByIdAndCreator(problemId, authenticatedUser);
            if (!isCreator)
                throw new Exception("You are not the creator of this problem.");
        }
        ProblemType problemType = problemTypeRepository.findById(request.getProblemTypeId()).get();
        ProblemLevel problemLevel = problemLevelRepository.findById(request.getProblemLevelId()).get();
        Problem problem = new Problem();
        problem.setId(request.getProblemId());
        problem.setTitle(request.getProblemTitle());
        problem.setContent(request.getProblemContent());
        problem.setLimitExplain(request.getLimitExplain());
        problem.setTimeLimit(request.getTimeLimit());
        problem.setMemoryLimit(request.getMemoryLimit());
        problem.setProblemLevel(problemLevel);
        problem.setProblemType(problemType);
        problem.setCreator(authenticatedUser);

        problemRepository.save(problem);

        InputOutputTableDto answerTable = request.getAnswerTable();
        InputOutputTableDto exampleTable = request.getExampleTable();
        addParamterAndReturnAndTestcaseInfoFromTableInfo(problem, answerTable, 'a');
        addParamterAndReturnAndTestcaseInfoFromTableInfo(problem, exampleTable, 'e');

        Optional<Problem> result = problemRepository.findById(1L);
        if (result.isPresent()) {
            Problem resultProblem = result.get();
            assertNotNull(resultProblem);
        }
    }

    @Test
    public void addUserSample() {
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

    private void addProblemTypeAndLevelAndDataTypeAndLanguageSample() {
        final ProblemLevel[] problemLevels = new ProblemLevel[] { new ProblemLevel(1L, 1), new ProblemLevel(2L, 2),
                new ProblemLevel(3L, 3), new ProblemLevel(4L, 4) };

        final ProblemType[] problemTypes = new ProblemType[] { new ProblemType(1L, "동적 계획법(Dynamic Programming)"),
                new ProblemType(2L, "해시"), new ProblemType(3L, "정렬"), new ProblemType(4L, "완전 탐색"),
                new ProblemType(5L, "탐욕법"), new ProblemType(6L, "힙(Heap)"), new ProblemType(7L, "스택/큐"),
                new ProblemType(8L, "깊이/너비 우선탐색(DFS/BFS)"), new ProblemType(9L, "이분 탐색"), new ProblemType(10L, "그래프"),
                new ProblemType(11L, "기타") };

        final DataType[] dataTypes = new DataType[] { new DataType(1L, "integer"), new DataType(2L, "integerArray"),
                new DataType(3L, "long"), new DataType(4L, "longArray"), new DataType(5L, "double"),
                new DataType(6L, "doubleArray"), new DataType(7L, "boolean"), new DataType(8L, "booleanArray"),
                new DataType(9L, "string"), new DataType(10L, "stringArray") };

        final Language[] languages = new Language[] { new Language(1L, "cpp"), new Language(2L, "python3"),
                new Language(3L, "java") };

        problemLevelRepository.saveAll(Stream.of(problemLevels).collect(Collectors.toList()));
        problemTypeRepository.saveAll(Stream.of(problemTypes).collect(Collectors.toList()));
        dataTypeRepository.saveAll(Stream.of(dataTypes).collect(Collectors.toList()));
        languageRepository.saveAll(Stream.of(languages).collect(Collectors.toList()));
    }

    @Test
    public void testGetProblemMetaData() {
        List<ProblemType> problemTypes = problemTypeRepository.findAll();
        List<ProblemLevel> problemLevels = problemLevelRepository.findAll();
        List<DataType> dataTypes = dataTypeRepository.findAll();
        List<Language> languages = languageRepository.findAll();
        assertTrue(problemTypes.size() > 0);
        assertTrue(problemLevels.size() > 0);
        assertTrue(dataTypes.size() > 0);
        assertTrue(languages.size() > 0);
    }

    @Test
    public void testRegisterOrUpdateProblem() throws Exception {
        // registerOrUpdateProblemSample(1L, 1L, true);
    }

    @Test
    public void testGetNewProblemId() {
        Problem lastProblem = problemRepository.findFirstByOrderByIdDesc();
        assertNotNull(lastProblem);
        long nextProblemId = lastProblem.getId() + 1;
        Problem reservedProblem = new Problem();
        reservedProblem.setId(nextProblemId);
        reservedProblem.setContent("");
        reservedProblem.setCreator(null);
        reservedProblem.setLimitExplain("");
        reservedProblem.setMemoryLimit(0);
        reservedProblem.setProblemLevel(null);
        reservedProblem.setProblemType(null);
        reservedProblem.setTimeLimit(0);
        reservedProblem.setTitle("");
        problemRepository.save(reservedProblem);
        System.out.println("newId: " + nextProblemId);
    }

 
    @Test
    public void testDeleteProblem() throws Exception {
        Long problemId = 1L;
        Long creatorId = 1L;
        // 로그인되어있는 유저 정보
        User authenticatedUser = userRepository.findById(creatorId).get();

        // 문제를 만든 사람이 삭제하려는 사람과 일치하는지 확인한다.
        boolean isCreator = problemRepository.existsByIdAndCreator(problemId, authenticatedUser);
        if (!isCreator)
            throw new Exception("You are not the creator of this problem.");
        Optional<Problem> problemOptional = problemRepository.findById(problemId);
        if (!problemOptional.isPresent())
            throw new Exception("The problem info is not correct.");
        Problem problem = problemOptional.get();
        // List<ProblemImage> problemImages = problemImageRepository.findAllByProblem(problem);
        // problemImages.stream().forEach(problemImage -> problemImage.getSaveFileName()/* delete file */);
        problemRepository.delete(problem);

    }

    @Test
    public void testSubmitProblemCode() throws Exception {
        submitProblemCode(1L, 1L, 1L);
        submitProblemCode(1L, 1L, 2L);
        submitProblemCode(1L, 1L, 3L);
    }

    private String getSubmittedProblemCodeSample(Language language) {
        String submittedCode;
        switch (language.getName()) {
            case "java":
                submittedCode = "import java.util.Arrays;\nimport java.util.stream.Collectors;\nString solution(int[] array){try{Thread.sleep(10000);}catch(Exception e){}return Arrays.stream(array).mapToObj(String::valueOf).collect(Collectors.joining(\"-\"));}";
                break;
            case "python3":
                submittedCode = "def solution(array):\n\treturn '-'.join(map(str, array))";
                break;
            case "cpp":
                submittedCode = "#include <string>\n#include <vector>\n#include<iostream>\n#include <sstream>\n"
                        + "using namespace std;\nstring solution(vector<int> array) {\n" + "stringstream ss;\n"
                        + "for(size_t i = 0; i < array.size(); ++i)\n" + "{\n" + "if(i != 0)\n" + "{\n"
                        + "ss << \"-\";\n" + "}\n" + "ss << array[i];\n" + "}return ss.str();}";
                break;
            default:
                submittedCode = "";
        }
        return submittedCode;
    }

    private List<MarkResultDto> submitProblemCode(Long creatorId, Long problemId, Long languageId) throws Exception {

        // 로그인되어있는 유저 정보
        final User authenticatedUser = userRepository.findById(creatorId).get();

        Optional<Language> languageOptional = languageRepository.findById(languageId);
        Optional<Problem> problemOptional = problemRepository.findById(problemId);
        if (!problemOptional.isPresent())
            throw new Exception("The problem info is not correct.");
        if (!languageOptional.isPresent())
            throw new Exception("The language info is not correct");
        final Language language = languageOptional.get();
        final Problem problem = problemOptional.get();
        final String submittedCode = getSubmittedProblemCodeSample(language);
        // 코드 생성 및 채점
        List<ProblemParameter> problemParameters = problemParameterRepository.findAllByProblemAndTableType(problem,
                'a');
        ProblemReturn problemReturn = problemReturnRepository.findByProblemAndTableType(problem, 'a');
        List<ProblemTestcase> problemTestcases = problemTestcaseRepository.findAllByProblemAndTableType(problem, 'a');
        List<List<ProblemParameterValue>> parameterValues = new ArrayList<>();
        List<String> returnValues = new ArrayList<>();

        for (ProblemTestcase problemTestcase : problemTestcases) {
            List<ProblemParameterValue> problemParameterValues = problemParameterValueRepository
                    .findAllByProblemTestcase(problemTestcase);
            parameterValues.add(problemParameterValues);
            returnValues.add(problemTestcase.getReturnValue());
        }

        List<MarkResultDto> markResultDtos = markCode(submittedCode, problem, language, problemParameters,
                problemReturn, parameterValues, returnValues, authenticatedUser);
        System.out.println(markResultDtos);
        return markResultDtos;
    }

    @Test
    public void testResetCode() throws Exception {
        final Long problemId = 1L;
        final Long languageId = 2L;
        final Long creatorId = 1L;
        // 로그인되어있는 유저 정보
        final User authenticatedUser = userRepository.findById(creatorId).get();
        // 코드 초기화시 솔루션과 코드 엔티티에 있는 내용 모두 삭제한다.
        // 코드 삭제하면 솔루션도 cascade로 삭제된다.
        Optional<Language> languageOptional = languageRepository.findById(languageId);
        Optional<Problem> problemOptional = problemRepository.findById(problemId);
        if (!problemOptional.isPresent())
            throw new Exception("The problem info is not correct.");
        if (!languageOptional.isPresent())
            throw new Exception("The language info is not correct");
        final Language language = languageOptional.get();
        final Problem problem = problemOptional.get();
        Optional<Code> codeOptional = codeRepository.findByProblemAndLanguageAndCreatorAndIsInitCode(problem, language, authenticatedUser, false);
        if(codeOptional.isPresent()){
            codeRepository.delete(codeOptional.get());
        }else{
            throw new Exception("The code info was not found");
        }

    }

    // 내가 푼 문제 수 가져오기
    @Test
    public void testGetMyResolveCount() {
        Long creatorId = 1L;
        // 로그인되어있는 유저 정보
        final User authenticatedUser = userRepository.findById(creatorId).get();
        long userResolvedProblemCount = solutionRepository.countProblemResolvedByCreator(authenticatedUser);
        System.out.println(userResolvedProblemCount);
    }

    @Test
    public void testGetProblemList() {
        Map<String, Object> response = new HashMap<>();
        Long creatorId = 1L;
        // 로그인되어있는 유저 정보
        final User authenticatedUser = userRepository.findById(creatorId).get();
        final List<Long> typeIds = Stream.of(new Long[] { 1L }).collect(Collectors.toList());
        final List<Long> levelIds = Stream.of(new Long[] { 1L, 2L, 3L, 4L }).collect(Collectors.toList());
        final Integer page = 1;

        assertTrue(page > 0);
        final int numberOfShow = 5;
        Page<Problem> problemPage = problemRepository.findAllByProblemTypeIdInAndProblemLevelIdIn(typeIds,
                levelIds, PageRequest.of(page - 1, numberOfShow));
        List<ProblemDto> problemDtos = new ArrayList<>();
        for (Problem problem : problemPage.getContent()) {
            long resolveCount = solutionRepository.countUserByResolvedProblem(problem);
            boolean createdByMe = problem.getCreator().getId() == authenticatedUser.getId();
            boolean resolved = solutionRepository.existsByProblemAndCreator(problem, authenticatedUser);
            ProblemDto problemDto = new ProblemDto();
            problemDto.setId(problem.getId());
            problemDto.setTitle(problem.getTitle());
            problemDto.setResolveCount(resolveCount);
            problemDto.setCreatedByMe(createdByMe);
            problemDto.setResolved(resolved);
            ProblemLevel problemLevel = problem.getProblemLevel();
            ProblemLevelDto problemLevelDto = new ProblemLevelDto();
            problemLevelDto.setId(problemLevel.getId());
            problemLevelDto.setName(problemLevel.getName());
            ProblemType problemType = problem.getProblemType();
            ProblemTypeDto problemTypeDto = new ProblemTypeDto();
            problemTypeDto.setId(problemType.getId());
            problemTypeDto.setName(problemType.getName());
            problemDto.setProblemType(problemTypeDto);
            problemDto.setLevel(problemLevelDto);
            problemDtos.add(problemDto);
        }
        response.put("problems", problemDtos);
        response.put("maxPage", problemPage.getTotalPages());
    }

    @Test
    public void testGetProblemDataAndCode() throws Exception {
        final Long problemId = 1L;
        final Long creatorId = 1L;
        Map<String, Object> response = new HashMap<>();
        // 로그인되어있는 유저 정보
        final User authenticatedUser = userRepository.findById(creatorId).get();

        Optional<Problem> problemOptional = problemRepository.findById(problemId);
        if (!problemOptional.isPresent())
            throw new Exception("The problem info is not correct");
        Problem problem = problemOptional.get();
        ProblemDetailDto problemDetailDto = createProblemDataResponseDto(problem, authenticatedUser);

        List<Language> languages = languageRepository.findAll();
        List<CodeDto> codeDtos = new ArrayList<>();
        for (Language language : languages) {
            CodeDto codeDto = new CodeDto();
            String prevCodeContent = null;
            String initCodeContent = null;
            Optional<Code> codeOptional = codeRepository.findByProblemAndLanguageAndCreatorAndIsInitCode(problem, language,
                    authenticatedUser, false);
            if (codeOptional.isPresent()) {
                prevCodeContent = codeOptional.get().getContent();
            }
            List<ProblemParameter> problemParameters = problemParameterRepository.findAllByProblemAndTableType(problem,
                    'a');
            ProblemReturn problemReturn = problemReturnRepository.findByProblemAndTableType(problem, 'a');
            initCodeContent = codeGenerateManager.makeInitCode(problemParameters, problemReturn, language);

            codeDto.setInitCode(initCodeContent);
            codeDto.setPrevCode(prevCodeContent);
            LanguageDto languageDto = new LanguageDto();
            languageDto.setId(language.getId());
            languageDto.setName(language.getName());
            codeDto.setLanguage(languageDto);
            codeDtos.add(codeDto);
        }

        response.put("problem", problemDetailDto);
        response.put("codes", codeDtos);
        System.out.println(response);
    }

    private List<MarkResultDto> markCode(String submittedCode, Problem problem, Language language,
            List<ProblemParameter> problemParameters, ProblemReturn problemReturn,
            List<List<ProblemParameterValue>> parameterValues, List<String> returnValues, User authenticatedUser)
            throws Exception {
        List<MarkResultDto> markResults = new ArrayList<>();

        // 코드 생성
        // 채점 및 채점 결과 생성
        String languageName = language.getName();
        final int testcaseSize = parameterValues.size();
        CompileErrorDto compileErrorDto = new CompileErrorDto();
        for (int idx = 0; idx < testcaseSize; idx++) {
            List<ProblemParameterValue> problemParameterValues = parameterValues.get(idx);
            String returnValue = returnValues.get(idx);
            CompileOption compileOption = compileManager.makeCompileOption(problemParameters, problemReturn,
                    problemParameterValues, returnValue, problem.getTimeLimit());
            final Consumer<? super MarkResultDto> resultHandler = res -> {
                markResults.add(res);
            };
            switch (languageName) {
                case "java":
                    compileManager.compileJava(submittedCode, compileOption, compileErrorDto).thenAccept(resultHandler);
                    break;
                case "python3":
                    compileManager.compilePython(submittedCode, compileOption, compileErrorDto).thenAccept(resultHandler);
                    break;
                case "cpp":
                    compileManager.compileCpp(submittedCode, compileOption, compileErrorDto).thenAccept(resultHandler);
                    break;
            }
            Thread.sleep(10);
        }

        /** Busy waiting */
        waitForAllTestcasesMarked(testcaseSize, markResults).get();

        if (markResults.size() == testcaseSize) {
            saveCodeMarkResult(markResults, submittedCode, authenticatedUser, problem, language);
        } else {
            throw new Exception("An error occured when marking the codes");
        }
        return markResults;
    }

    @Async
    private CompletableFuture<Boolean> waitForAllTestcasesMarked(int testcaseSize, List<MarkResultDto> markResults) {
        while (markResults.size() != testcaseSize) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException ie) {
                break;
            }
        }
        return CompletableFuture.completedFuture(true);
    }

    private void saveCodeMarkResult(List<MarkResultDto> results, String submittedCode, User authenticatedUser,
            Problem problem, Language language) {
        boolean isAnswer = results.stream().allMatch(result -> result.getIsAnswer());
        // 정답이든 아니든 code 엔티티에 저장(코드 저장)
        Optional<Code> codeOptional = codeRepository.findByProblemAndLanguageAndCreatorAndIsInitCode(problem, language, authenticatedUser, false);
        Code code = null;
        // 이전에 작성한 코드가 있으면 덮어쓴다.
        if (codeOptional.isPresent()) {
            code = codeOptional.get();
        } else {
            code = new Code();
            code.setProblem(problem);
            code.setLanguage(language);
        }
        code.setContent(submittedCode);
        code.setCreator(authenticatedUser);
        code.setIsInitCode(false);
        codeRepository.save(code);

        // 정답일 경우 solution 엔티티에 저장
        if (isAnswer) {
            Optional<Solution> solutionOptional = solutionRepository.findByCode(code);
            Solution solution = null;
            // 이전에 작성된 솔루션이 있으면 덮어쓴다.
            if (solutionOptional.isPresent()) {
                solution = solutionOptional.get();
                if (!solution.getCreator().getId().equals(authenticatedUser.getId()))
                    return;
            } else {
                solution = new Solution();
                solution.setProblem(problem);
                solution.setCreator(authenticatedUser);
            }
            solution.setCode(code);
            solutionRepository.save(solution);
        }
    }

    private void addParamterAndReturnAndTestcaseInfoFromTableInfo(Problem problem, InputOutputTableDto table,
            char tableType) throws Exception {
        List<ParameterDto> params = table.getParams();

        for (ParameterDto parameterDto : params) {
            ProblemParameter problemParameter = new ProblemParameter();
            problemParameter.setTableType(tableType);
            Optional<DataType> dataTypeOptional = dataTypeRepository.findById(parameterDto.getDataType().getId());
            if (!dataTypeOptional.isPresent()) {
                throw new Exception("The datatype info is not correct.");
            }
            problemParameter.setDataType(dataTypeOptional.get());
            problemParameter.setName(parameterDto.getName());
            problemParameter.setProblem(problem);
            problemParameterRepository.save(problemParameter);
        }

        ReturnDto returnDto = table.getReturns();
        ProblemReturn problemReturn = new ProblemReturn();
        problemReturn.setTableType(tableType);
        Optional<DataType> dataTypeOptional = dataTypeRepository.findById(returnDto.getDataType().getId());
        if (!dataTypeOptional.isPresent()) {
            throw new Exception("The data type info is not correct.");
        }
        problemReturn.setDataType(dataTypeOptional.get());
        problemReturn.setProblem(problem);
        problemReturnRepository.save(problemReturn);

        List<TestcaseDto> testcases = table.getTestcases();
        for (TestcaseDto testcase : testcases) {
            ProblemTestcase problemTestcase = new ProblemTestcase();
            problemTestcase.setTableType(tableType);
            problemTestcase.setReturnValue(testcase.getReturns());
            problemTestcase.setProblem(problem);
            problemTestcaseRepository.save(problemTestcase);
            for (String param : testcase.getParams()) {
                ProblemParameterValue problemParameterValue = new ProblemParameterValue();
                problemParameterValue.setValue(param);
                problemParameterValue.setProblemTestcase(problemTestcase);
                problemParameterValueRepository.save(problemParameterValue);
            }

        }
    }

    private RegisterOrUpdateProblemRequestDto createRegisterOrUpdateProblemRequestDtoSample(Long problemId) {
        RegisterOrUpdateProblemRequestDto request = new RegisterOrUpdateProblemRequestDto();
        request.setProblemId(problemId);
        request.setProblemTitle("배열을 하이폰으로 구분해서 스트링으로 나타내기");
        request.setProblemTypeId(2L);
        request.setLimitExplain("제한 사항");
        request.setMemoryLimit(256);
        request.setProblemLevelId(1L);
        request.setTimeLimit(1000);
        request.setProblemContent("문제 설명");
        InputOutputTableDto table = new InputOutputTableDto();
        ParameterDto parameterDto1 = new ParameterDto();

        DataTypeDto paramDataTypeDto = new DataTypeDto();
        paramDataTypeDto.setId(2L); // integer array
        parameterDto1.setDataType(paramDataTypeDto);
        parameterDto1.setName("param1");
        List<ParameterDto> parameterDtos = new ArrayList<>();
        parameterDtos.add(parameterDto1);
        table.setParams(parameterDtos);

        ReturnDto returnDto = new ReturnDto();

        DataTypeDto returnDataTypeDto = new DataTypeDto();
        returnDataTypeDto.setId(9L); // string
        returnDto.setDataType(returnDataTypeDto);
        table.setReturns(returnDto);

        List<TestcaseDto> testcaseDtos = new ArrayList<>();
        TestcaseDto testcaseDto = new TestcaseDto();
        List<String> paramValues = new ArrayList<>();
        paramValues.add("[5, 5, 5, 5]");
        testcaseDto.setParams(paramValues);
        testcaseDto.setReturns("\"5-5-5-5\"");
        testcaseDtos.add(testcaseDto);

        TestcaseDto testcaseDto2 = new TestcaseDto();
        List<String> paramValues2 = new ArrayList<>();
        paramValues2.add("[46, 13, 6, 79]");
        testcaseDto2.setParams(paramValues2);
        testcaseDto2.setReturns("\"46-13-6-79\"");
        testcaseDtos.add(testcaseDto2);
        table.setTestcases(testcaseDtos);

        request.setAnswerTable(table);
        request.setExampleTable(table);
        return request;
    }

    private ProblemDetailDto createProblemDataResponseDto(Problem problem, User creator) {
        ProblemDetailDto response = new ProblemDetailDto();
        response.setId(problem.getId());
        response.setTitle(problem.getTitle());
        ProblemTypeDto problemTypeDto = new ProblemTypeDto();
        ProblemType problemType = problem.getProblemType();
        problemTypeDto.setId(problemType.getId());
        problemTypeDto.setName(problemType.getName());
        response.setProblemType(problemTypeDto);
        response.setLimitExplain(problem.getLimitExplain());
        response.setMemoryLimit(problem.getMemoryLimit());
        ProblemLevel problemLevel = problem.getProblemLevel();
        ProblemLevelDto problemLevelDto = new ProblemLevelDto();
        problemLevelDto.setId(problemLevel.getId());
        problemLevelDto.setName(problemLevel.getName());
        response.setLevel(problemLevelDto);
        response.setTimeLimit(problem.getTimeLimit());
        response.setExplain(problem.getContent());

        InputOutputTableDto answerTable = createInputOutputTableDto(problem, 'a');
        InputOutputTableDto exampleTable = createInputOutputTableDto(problem, 'e');

        response.setAnswerTable(answerTable);
        response.setExampleTable(exampleTable);
        UserRequestDto userDto = new UserRequestDto();
        userDto.setId(creator.getId());
        userDto.setNickname(creator.getNickname());
        response.setCreator(userDto);
        return response;
    }

    private InputOutputTableDto createInputOutputTableDto(Problem problem, Character tableType) {
        List<ProblemParameter> problemParameters = problemParameterRepository.findAllByProblemAndTableType(problem,
                tableType);
        ProblemReturn problemReturn = problemReturnRepository.findByProblemAndTableType(problem, tableType);
        List<ProblemTestcase> problemTestcases = problemTestcaseRepository.findAllByProblemAndTableType(problem,
                tableType);

        InputOutputTableDto table = new InputOutputTableDto();

        List<ParameterDto> parameterDtos = new ArrayList<>();
        for (ProblemParameter problemParameter : problemParameters) {
            ParameterDto parameterDto = new ParameterDto();
            DataTypeDto dataTypeDto = new DataTypeDto();
            DataType paramDataType = problemReturn.getDataType();
            dataTypeDto.setId(paramDataType.getId());
            dataTypeDto.setName(paramDataType.getName());
            parameterDto.setDataType(dataTypeDto);
            parameterDto.setName(problemParameter.getName());
            parameterDtos.add(parameterDto);
        }
        table.setParams(parameterDtos);

        ReturnDto returnDto = new ReturnDto();

        DataTypeDto returnDataTypeDto = new DataTypeDto();
        DataType returnDataType = problemReturn.getDataType();
        returnDataTypeDto.setId(returnDataType.getId());
        returnDataTypeDto.setName(returnDataType.getName());
        returnDto.setDataType(returnDataTypeDto);
        table.setReturns(returnDto);

        List<TestcaseDto> testcaseDtos = new ArrayList<>();
        for (ProblemTestcase problemTestcase : problemTestcases) {
            TestcaseDto testcaseDto = new TestcaseDto();
            List<String> paramValues = new ArrayList<>();
            List<ProblemParameterValue> problemParameterValues = problemParameterValueRepository
                    .findAllByProblemTestcase(problemTestcase);
            for (ProblemParameterValue problemParameterValue : problemParameterValues) {
                paramValues.add(problemParameterValue.getValue());
            }

            testcaseDto.setParams(paramValues);
            testcaseDto.setReturns(problemTestcase.getReturnValue());
            testcaseDtos.add(testcaseDto);
        }
        table.setTestcases(testcaseDtos);
        return table;
    }
}