package com.goodperson.code.expert;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.goodperson.code.expert.dto.CodeDto;
import com.goodperson.code.expert.dto.CompileResultDto;
import com.goodperson.code.expert.dto.DataTypeDto;
import com.goodperson.code.expert.dto.GetProblemDataResponseDto;
import com.goodperson.code.expert.dto.InputOutputTableDto;
import com.goodperson.code.expert.dto.LanguageDto;
import com.goodperson.code.expert.dto.ParameterDto;
import com.goodperson.code.expert.dto.ProblemDto;
import com.goodperson.code.expert.dto.ProblemLevelDto;
import com.goodperson.code.expert.dto.ProblemTypeDto;
import com.goodperson.code.expert.dto.RegisterOrUpdateProblemRequestDto;
import com.goodperson.code.expert.dto.ReturnDto;
import com.goodperson.code.expert.dto.TestcaseDto;
import com.goodperson.code.expert.dto.UserDto;
import com.goodperson.code.expert.model.Code;
import com.goodperson.code.expert.model.DataType;
import com.goodperson.code.expert.model.Language;
import com.goodperson.code.expert.model.Problem;
import com.goodperson.code.expert.model.ProblemImage;
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
import com.goodperson.code.expert.repository.ProblemImageRepository;
import com.goodperson.code.expert.repository.ProblemLevelRepository;
import com.goodperson.code.expert.repository.ProblemParameterValueRepository;
import com.goodperson.code.expert.repository.ProblemParamterRepository;
import com.goodperson.code.expert.repository.ProblemRepository;
import com.goodperson.code.expert.repository.ProblemReturnRepository;
import com.goodperson.code.expert.repository.ProblemTestcaseRepository;
import com.goodperson.code.expert.repository.ProblemTypeRepository;
import com.goodperson.code.expert.repository.SolutionRepository;
import com.goodperson.code.expert.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

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
    private ProblemImageRepository problemImageRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private CodeRepository codeRepository;

    @Autowired
    private SolutionRepository solutionRepository;

    @BeforeEach
    public void executeBeforeTests() throws Exception {
        // addUserSample();
        // addProblemTypeAndLevelAndDataTypeAndLanguageSample();
        // registerOrUpdateProblemSample(1L, 1L, false);
        // registerOrUpdateProblemSample(2L, 1L, false);

        // testUploadProblemImage();
        // submitProblemCode(1L, 1L, 1L);
        // submitProblemCode(2L, 1L, 2L);
        // submitProblemCode(1L, 2L, 1L);
        // submitProblemCode(2L, 2L, 3L);
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

    private void addProblemTypeAndLevelAndDataTypeAndLanguageSample() {
        final ProblemLevel[] problemLevels = new ProblemLevel[] { new ProblemLevel(1), new ProblemLevel(2),
                new ProblemLevel(3), new ProblemLevel(4) };

        final ProblemType[] problemTypes = new ProblemType[] { new ProblemType("동적 계획법(Dynamic Programming)"),
                new ProblemType("해시"), new ProblemType("정렬"), new ProblemType("완전 탐색"), new ProblemType("탐욕법"),
                new ProblemType("힙(Heap)"), new ProblemType("스택/큐"), new ProblemType("깊이/너비 우선탐색(DFS/BFS)"),
                new ProblemType("이분 탐색"), new ProblemType("그래프"), new ProblemType("기타") };

        final DataType[] dataTypes = new DataType[] { new DataType("integer"), new DataType("integer_array"),
                new DataType("long"), new DataType("long_array"), new DataType("double"), new DataType("double_array"),
                new DataType("boolean"), new DataType("boolean_array"), new DataType("string"),
                new DataType("string_array") };

        final Language[] languages = new Language[] { new Language("cpp"), new Language("python3"),
                new Language("java") };

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
        System.out.println("newId: " + lastProblem.getId() + 1);
    }

    @Test
    public void testUploadProblemImage() throws Exception {
        Long problemId = 1L;
        String originalFileName = "sample.jpg";

        String matchedContentType = getContentTypeFromFileName(originalFileName);
        Optional<ProblemImage> sameFileNameProblemImageOptional = problemImageRepository
                .findByFileName(originalFileName);
        String saveFileName;
        if (sameFileNameProblemImageOptional.isPresent()) {
            saveFileName = getUniqueSaveFileName(sameFileNameProblemImageOptional.get().getSaveFileName());
        } else {
            saveFileName = originalFileName;
        }

        assertTrue(matchedContentType.startsWith("image/"));

        ProblemImage problemImage = new ProblemImage();
        Problem problem = new Problem();
        problem.setId(problemId);

        problemImage.setContentType(matchedContentType);
        problemImage.setFileName(originalFileName);
        problemImage.setSaveFileName(saveFileName);
        problemImage.setProblem(problem);
        problemImageRepository.save(problemImage);
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
        Problem problem = new Problem();
        problem.setId(problemId);

        problemRepository.delete(problem);

    }

    @Test
    public void testSubmitProblemCode() throws Exception {
        submitProblemCode(1L, 1L, 2L);
    }

    private void submitProblemCode(Long creatorId, Long problemId, Long languageId) throws Exception {
        final String submittedCode = "def solution(array):\n\treturn '-'.join(map(str, array))";

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
        // 코드 생성 및 채점
        List<CompileResultDto> results = markCode(submittedCode, problem, language);
        boolean isAnswer = results.stream().allMatch(result -> result.getIsAnswer());

        // 정답이든 아니든 code 엔티티에 저장(코드 저장)
        Optional<Code> codeOptional = codeRepository.findByProblemAndLanguageAndCreator(problem, language,
                authenticatedUser);
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
        codeRepository.save(code);

        // 정답일 경우 solution 엔티티에 저장
        if (isAnswer) {
            Optional<Solution> solutionOptional = solutionRepository.findByCode(code);
            Solution solution = null;
            // 이전에 작성된 솔루션이 있으면 덮어쓴다.
            if (solutionOptional.isPresent()) {
                solution = solutionOptional.get();
                if (!solution.getCreator().getId().equals(authenticatedUser.getId()))
                    throw new Exception("You are not the creator of this problem.");
            } else {
                solution = new Solution();
                solution.setProblem(problem);
                solution.setCreator(authenticatedUser);
            }
            solution.setCode(code);
            solutionRepository.save(solution);
        }
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
        Optional<Code> codeOptional = codeRepository.findByProblemAndLanguageAndCreator(problem, language,
                authenticatedUser);
        if (codeOptional.isPresent()) {
            Code code = codeOptional.get();
            codeRepository.delete(code);
        }

    }

    // 내가 푼 문제 수 가져오기
    @Test
    public void testGetMyResolveCount() {
        Long creatorId = 1L;
        // 로그인되어있는 유저 정보
        final User authenticatedUser = userRepository.findById(creatorId).get();
        long userResolvedCount = solutionRepository.countProblemResolvedByCreator(authenticatedUser);
        System.out.println(userResolvedCount);
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
        Page<Problem> problemPage = problemRepository.findAllByProblemTypeIdInOrProblemLevelIdIn(typeIds, levelIds,
                PageRequest.of(page - 1, numberOfShow));
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
            problemDto.setType(problemTypeDto);
            problemDto.setLevel(problemLevelDto);
            problemDtos.add(problemDto);
        }
        response.put("problems", problemDtos);
        response.put("max_page", problemPage.getTotalPages());
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
        GetProblemDataResponseDto getProblemDataResponseDto = createGetProblemDataResponseDto(problem,
                authenticatedUser);

        List<Language> languages = languageRepository.findAll();
        List<CodeDto> codeDtos = new ArrayList<>();
        for (Language language : languages) {
            CodeDto codeDto = new CodeDto();
            String prevCodeContent = null;
            String initCodeContent = null;
            Optional<Code> codeOptional = codeRepository.findByProblemAndLanguageAndCreator(problem, language,
                    authenticatedUser);
            if (codeOptional.isPresent()) {
                prevCodeContent = codeOptional.get().getContent();
            }
            List<ProblemParameter> problemParameters = problemParameterRepository.findAllByProblemAndTableType(problem,
                    'a');
            ProblemReturn problemReturn = problemReturnRepository.findByProblemAndTableType(problem, 'a');
            initCodeContent = makeInitCode(problemParameters, problemReturn, language);

            codeDto.setInitCode(initCodeContent);
            codeDto.setPrevCode(prevCodeContent);
            LanguageDto languageDto = new LanguageDto();
            languageDto.setId(language.getId());
            languageDto.setName(language.getName());
            codeDto.setLanguage(languageDto);
            codeDtos.add(codeDto);
        }

        response.put("problem", getProblemDataResponseDto);
        response.put("codes", codeDtos);
        System.out.println(response);
    }

    private String makeInitCode(List<ProblemParameter> problemParameters, ProblemReturn problemReturn,
            Language language) {
        switch (language.getName()) {
            case "java":
                return makeJavaInitCode(problemParameters, problemReturn);
            case "cpp":
                return makeCppInitCode(problemParameters, problemReturn);
            case "python3":
                return makePythonInitCode(problemParameters, problemReturn);
        }
        return "에러가 발생했습니다.";
    }

    private String makeCppInitCode(List<ProblemParameter> problemParameters, ProblemReturn problemReturn) {
        StringBuilder stringBuilder = new StringBuilder(
                "#include <string>\n#include <vector>\nusing namespace std;\n\n");
        String returnDataTypeExpression = "";
        String returnDataTypeName = problemReturn.getDataType().getName();
        returnDataTypeExpression = getCppDataTypeExpression(returnDataTypeName);
        stringBuilder.append(returnDataTypeExpression);
        stringBuilder.append("solution(");
        final int parameterCount = problemParameters.size();
        for (int idx = 0; idx < parameterCount; idx++) {
            ProblemParameter parameter = problemParameters.get(idx);
            String paramDataTypeName = parameter.getDataType().getName();
            stringBuilder.append(getCppDataTypeExpression(paramDataTypeName));
            stringBuilder.append(parameter.getName());
            if (idx != parameterCount - 1)
                stringBuilder.append(", ");
        }
        stringBuilder.append(")\n{\n\t");
        stringBuilder.append(returnDataTypeExpression);
        stringBuilder.append("answer = ");
        stringBuilder.append(getCppValueExpression(returnDataTypeName));
        stringBuilder.append(";\n\treturn answer;\n}");
        return stringBuilder.toString();
    }

    private String getCppDataTypeExpression(String dataTypeName) {
        String dataTypeExpression;
        switch (dataTypeName) {
            case "integer":
                dataTypeExpression = "int ";
                break;
            case "integer_array":
                dataTypeExpression = "vector<int> ";
                break;
            case "integer_2d_array":
                dataTypeExpression = "vector<vector<int>> ";
                break;
            case "long":
                dataTypeExpression = "long ";
                break;
            case "long_array":
                dataTypeExpression = "vector<long> ";
                break;
            case "long_2d_array":
                dataTypeExpression = "vector<vector<long>> ";
                break;
            case "double":
                dataTypeExpression = "double ";
                break;
            case "double_array":
                dataTypeExpression = "vector<double> ";
                break;
            case "double_2d_array":
                dataTypeExpression = "vector<vector<double>> ";
                break;
            case "boolean":
                dataTypeExpression = "bool ";
                break;
            case "boolean_array":
                dataTypeExpression = "vector<boolean> ";
                break;
            case "string":
                dataTypeExpression = "string ";
                break;
            case "string_array":
                dataTypeExpression = "vector<string> ";
                break;
            default:
                dataTypeExpression = "void ";
                break;
        }
        return dataTypeExpression;
    }

    private String getCppValueExpression(String dataTypeName) {
        String dataTypeExpression;
        if (dataTypeName.endsWith("2d_array")) {
            dataTypeExpression = "{{}}";
        } else if (dataTypeName.endsWith("_array")) {
            dataTypeExpression = "{}";
        }
        switch (dataTypeName) {
            case "integer":
            case "long":
            case "double":
                dataTypeExpression = "0";
                break;
            case "boolean":
                dataTypeExpression = "true";
                break;
            case "string":
                dataTypeExpression = "\"\"";
                break;
            default:
                dataTypeExpression = "nullptr";
                break;
        }
        return dataTypeExpression;
    }

    private String makePythonInitCode(List<ProblemParameter> problemParameters, ProblemReturn problemReturn) {
        StringBuilder stringBuilder = new StringBuilder("def solution(");
        final int parameterCount = problemParameters.size();
        for (int idx = 0; idx < parameterCount; idx++) {
            stringBuilder.append(problemParameters.get(idx).getName());
            if (idx != parameterCount - 1)
                stringBuilder.append(", ");
        }
        stringBuilder.append("):\n\tanswer = ");
        final String returnValueExpression;
        final String returnDataTypeName = problemReturn.getDataType().getName();
        if (returnDataTypeName.endsWith("2d_array")) {
            returnValueExpression = "[[]]";
        } else if (returnDataTypeName.endsWith("_array")) {
            returnValueExpression = "[]";
        } else {
            switch (returnDataTypeName) {
                case "integer":
                case "long":
                case "double":
                    returnValueExpression = "0";
                    break;
                case "boolean":
                    returnValueExpression = "true";
                    break;
                case "string":
                    returnValueExpression = "''";
                    break;
                default:
                    returnValueExpression = "";
                    break;
            }
        }
        stringBuilder.append(returnValueExpression);
        stringBuilder.append("\n\treturn answer");
        return stringBuilder.toString();
    }

    private String makeJavaInitCode(List<ProblemParameter> problemParameters, ProblemReturn problemReturn) {
        StringBuilder stringBuilder = new StringBuilder();
        String returnDataTypeExpression = "";
        String returnDataTypeName = problemReturn.getDataType().getName();
        returnDataTypeExpression = getJavaDataTypeExpression(returnDataTypeName);
        stringBuilder.append(returnDataTypeExpression);
        stringBuilder.append("solution(");
        final int parameterCount = problemParameters.size();
        for (int idx = 0; idx < parameterCount; idx++) {
            ProblemParameter parameter = problemParameters.get(idx);
            String paramDataTypeName = parameter.getDataType().getName();
            stringBuilder.append(getJavaDataTypeExpression(paramDataTypeName));
            stringBuilder.append(parameter.getName());
            if (idx != parameterCount - 1)
                stringBuilder.append(", ");
        }
        stringBuilder.append(")\n{\n\t");
        stringBuilder.append(returnDataTypeExpression);
        stringBuilder.append("answer = ");
        stringBuilder.append(getJavaValueExpression(returnDataTypeName));
        stringBuilder.append(";\nreturn answer;\n}");
        return stringBuilder.toString();
    }

    private String getJavaValueExpression(String dataTypeName) {
        String dataTypeValue;
        switch (dataTypeName) {
            case "integer":
            case "long":
            case "double":
                dataTypeValue = "0";
                break;
            case "integer_array":
                dataTypeValue = "new int[]{}";
                break;
            case "integer_2d_array":
                dataTypeValue = "new int[][]{}";
                break;
            case "long_array":
                dataTypeValue = "new long[]{}";
                break;
            case "long_2d_array":
                dataTypeValue = "new long[][]{}";
                break;
            case "double_array":
                dataTypeValue = "new double[]{}";
                break;
            case "double_2d_array":
                dataTypeValue = "new double[][]{}";
                break;
            case "boolean":
                dataTypeValue = "true";
                break;
            case "boolean_array":
                dataTypeValue = "new boolean[]{}";
                break;
            case "string":
                dataTypeValue = "\"\"";
                break;
            case "string_array":
                dataTypeValue = "new String[]{}";
                break;
            default:
                dataTypeValue = "null";
                break;
        }
        return dataTypeValue;
    }

    private String getJavaDataTypeExpression(String dataTypeName) {
        String dataTypeExpression;
        switch (dataTypeName) {
            case "integer":
                dataTypeExpression = "int ";
                break;
            case "integer_array":
                dataTypeExpression = "int[] ";
                break;
            case "integer_2d_array":
                dataTypeExpression = "int[][] ";
                break;
            case "long":
                dataTypeExpression = "long ";
                break;
            case "long_array":
                dataTypeExpression = "long[] ";
                break;
            case "long_2d_array":
                dataTypeExpression = "long[][] ";
                break;
            case "double":
                dataTypeExpression = "double ";
                break;
            case "double_array":
                dataTypeExpression = "double[] ";
                break;
            case "double_2d_array":
                dataTypeExpression = "double[][] ";
                break;
            case "boolean":
                dataTypeExpression = "boolean ";
                break;
            case "boolean_array":
                dataTypeExpression = "boolean[] ";
                break;
            case "string":
                dataTypeExpression = "String ";
                break;
            case "string_array":
                dataTypeExpression = "String[] ";
                break;
            default:
                dataTypeExpression = "void ";
                break;
        }
        return dataTypeExpression;
    }

    private List<CompileResultDto> markCode(String submittedCode, Problem problem, Language language) throws Exception {
        List<CompileResultDto> results = new ArrayList<>();

        // 코드 생성
        List<ProblemParameter> problemParameters = problemParameterRepository.findAllByProblemAndTableType(problem,
                'a');
        ProblemReturn problemReturn = problemReturnRepository.findByProblemAndTableType(problem, 'a');
        System.out.println(problemReturn.getDataType().getName());

        List<ProblemTestcase> problemTestcases = problemTestcaseRepository.findAllByProblemAndTableType(problem, 'a');

        // 채점 및 채점 결과 생성
        String languageName = language.getName();
        System.out.println(languageName);

        for (ProblemTestcase problemTestcase : problemTestcases) {
            List<ProblemParameterValue> problemParameterValues = problemParameterValueRepository
                    .findAllByProblemTestcase(problemTestcase);
            System.out.println(problemParameterValues);

            String returnValue = problemTestcase.getReturnValue();
            System.out.println(returnValue);

            CompileResultDto result = null;
            List<String> compileOptions = makeCompileOptionCommands(problemParameters, problemReturn,
                    problemParameterValues, problemTestcase, problem.getTimeLimit());
            switch (languageName) {
                case "java":
                    result = null;
                    break;
                case "python3":
                    result = compilePython(submittedCode, compileOptions);
                    break;
                case "cpp":
                    result = null;
                    break;
            }
            if (result != null)
                results.add(result);
        }

        return results;
    }

    // 파일명이 중복되어 db에 저장되지 않도록 유니크한 파일명을 만드는 메소드
    private String getUniqueSaveFileName(String sameFileName) throws Exception {
        final String prefix = getFileNameExceptExtension(sameFileName);
        final String suffix = getFileExtension(sameFileName);
        Matcher matcher = Pattern.compile("\\d+$").matcher(prefix);
        String uniqueName = "";
        if (matcher.find()) {
            uniqueName = prefix.substring(0, matcher.start()) + (Integer.parseInt(matcher.group()) + 1) + suffix;
        } else {
            uniqueName = prefix + "2" + suffix;
        }
        return uniqueName;

    }

    private String getContentTypeFromFileName(String fileName) {
        return URLConnection.guessContentTypeFromName(fileName);
    }

    private String getFileExtension(String fileName) throws Exception {
        int idx = fileName.lastIndexOf('.');
        if (idx == -1)
            throw new Exception("The file info is not correct.");
        return fileName.substring(idx, fileName.length());
    }

    private String getFileNameExceptExtension(String fileName) throws Exception {
        int idx = fileName.lastIndexOf('.');
        if (idx == -1)
            throw new Exception("The file info is not correct.");
        return fileName.substring(0, idx);
    }

    private void addParamterAndReturnAndTestcaseInfoFromTableInfo(Problem problem, InputOutputTableDto table,
            char tableType) {
        List<ParameterDto> params = table.getParams();

        for (ParameterDto parameterDto : params) {
            ProblemParameter problemParameter = new ProblemParameter();
            problemParameter.setTableType(tableType);
            problemParameter.setDataType(new DataType(parameterDto.getDataType().getId()));
            problemParameter.setName(parameterDto.getName());
            problemParameter.setProblem(problem);
            problemParameterRepository.save(problemParameter);
        }

        ReturnDto returnDto = table.getReturns();
        ProblemReturn problemReturn = new ProblemReturn();
        problemReturn.setTableType(tableType);
        problemReturn.setDataType(new DataType(returnDto.getDataType().getId()));
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
        request.setTimeLimit(100);
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
        returnDataTypeDto.setId(12L); // string
        returnDto.setDataType(returnDataTypeDto);
        table.setReturns(returnDto);

        TestcaseDto testcaseDto = new TestcaseDto();
        List<String> paramValues = new ArrayList<>();
        paramValues.add("[5, 5, 5, 5]");
        testcaseDto.setParams(paramValues);
        testcaseDto.setReturns("\"5-5-5-5\"");
        List<TestcaseDto> testcaseDtos = new ArrayList<>();
        testcaseDtos.add(testcaseDto);
        table.setTestcases(testcaseDtos);

        request.setAnswerTable(table);
        request.setExampleTable(table);
        return request;
    }

    private GetProblemDataResponseDto createGetProblemDataResponseDto(Problem problem, User creator) {
        GetProblemDataResponseDto response = new GetProblemDataResponseDto();
        response.setId(problem.getId());
        response.setTitle(problem.getTitle());
        ProblemTypeDto problemTypeDto = new ProblemTypeDto();
        ProblemType problemType = problem.getProblemType();
        problemTypeDto.setId(problemType.getId());
        problemTypeDto.setName(problemType.getName());
        response.setType(problemTypeDto);
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
        UserDto userDto = new UserDto();
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

    private List<String> makeCompileOptionCommands(List<ProblemParameter> problemParameters,
            ProblemReturn problemReturn, List<ProblemParameterValue> problemParameterValues,
            ProblemTestcase problemTestcase, int timeOutInMilliseconds) {
        List<String> compileOptions = new ArrayList<>();
        // "timeout:" + 500,
        // "integer_array:[1, 2, 3, 4]", "integer:10"

        int paramLength = problemParameters.size();
        compileOptions.add("timeout:" + timeOutInMilliseconds);
        for (int paramIdx = 0; paramIdx < paramLength; paramIdx++) {
            String paramDataType = problemParameters.get(paramIdx).getDataType().getName();
            String paramValue = problemParameterValues.get(paramIdx).getValue();
            compileOptions.add(paramDataType.concat(":").concat(paramValue));
        }
        String returnDataType = problemReturn.getDataType().getName();
        String returnValue = problemTestcase.getReturnValue();
        compileOptions.add(returnDataType.concat(":").concat(returnValue));

        return compileOptions;
    }

    // python으로 컴파일 하기
    private CompileResultDto compilePython(String code, List<String> compileOptions) throws Exception {
        LocalDateTime now = LocalDateTime.now();
        final Path validaterFilePath = Paths
                .get("D:/Programming/CodeExpert/backend/src/test/java/com/goodperson/code/expert/python_compiler.py");

        final String validateCode = Files.readString(validaterFilePath);
        code = code + "\n" + validateCode;
        File compileDirectory = new File("C:/code_expert/compile/", now.format(DateTimeFormatter.BASIC_ISO_DATE));
        if (!compileDirectory.exists())
            compileDirectory.mkdirs();

        File compileFile = new File(compileDirectory,
                now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS")) + ".py");
        compileFile.createNewFile();
        try (FileWriter fileWriter = new FileWriter(compileFile, false);) {
            fileWriter.write(code);
        }

        String pythonPath = "D:/Program files/Python3.8/python.exe";
        String[] commands = null;
        compileOptions.add(0, pythonPath);
        compileOptions.add(1, compileFile.getAbsolutePath());
        commands = compileOptions.toArray(String[]::new);
        Runtime runtime = Runtime.getRuntime();

        Process process = runtime.exec(commands);
        process.waitFor();
        try (BufferedReader error = new BufferedReader(new InputStreamReader(process.getErrorStream()));
                BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));) {
            String line = "";
            StringBuffer errorBuffer = new StringBuffer();
            StringBuffer outputBuffer = new StringBuffer();
            boolean isTimeOut = false;
            boolean isAnswer = false;
            Double timeElapsed = null;
            String expected = null;
            String actual = null;
            String errorMessage = null;
            String outputMessage = null;
            while ((line = error.readLine()) != null) {
                if (line.startsWith("$timeout|")) {
                    isTimeOut = true;
                    break;
                } else {
                    errorBuffer.append(line);
                    errorBuffer.append("\n");
                }
            }
            while ((line = input.readLine()) != null) {
                if (line.equals("$answer")) {
                    isAnswer = true;
                } else if (line.startsWith("$not_answer|")) {
                    String[] splitted = line.split("\\|");
                    expected = splitted[1];
                    actual = splitted[2];
                } else if (line.startsWith("$time|")) {
                    String[] splitted = line.split("\\|");
                    timeElapsed = Double.valueOf(splitted[1]);
                } else {
                    outputBuffer.append(line);
                    outputBuffer.append("\n");
                }
            }
            errorMessage = errorBuffer.toString();
            outputMessage = outputBuffer.toString();

            CompileResultDto compileResultDto = new CompileResultDto();
            compileResultDto.setActual(actual);
            compileResultDto.setErrorMessage(errorMessage);
            compileResultDto.setExpected(expected);
            compileResultDto.setIsAnswer(isAnswer);
            compileResultDto.setIsTimeOut(isTimeOut);
            compileResultDto.setOutputMessage(outputMessage);
            compileResultDto.setTimeElapsed(timeElapsed);
            compileFile.deleteOnExit();
            return compileResultDto;
        }
    }

}