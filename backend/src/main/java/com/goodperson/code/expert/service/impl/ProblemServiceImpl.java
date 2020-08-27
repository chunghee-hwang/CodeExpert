package com.goodperson.code.expert.service.impl;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
import com.goodperson.code.expert.dto.ProblemMetaDataDto;
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
import com.goodperson.code.expert.service.AccountService;
import com.goodperson.code.expert.service.ProblemService;
import com.goodperson.code.expert.utils.CodeGenerateManager;
import com.goodperson.code.expert.utils.CompileManager;
import com.goodperson.code.expert.utils.CompileOption;
import com.goodperson.code.expert.utils.validation.CodeValidation;
import com.goodperson.code.expert.utils.validation.ProblemValidation;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import io.leangen.graphql.annotations.GraphQLMutation;
import io.leangen.graphql.annotations.GraphQLQuery;
import io.leangen.graphql.metadata.strategy.query.AnnotatedResolverBuilder;
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi;
import io.leangen.graphql.spqr.spring.annotations.WithResolverBuilder;

@Service
@GraphQLApi
@WithResolverBuilder(AnnotatedResolverBuilder.class)
public class ProblemServiceImpl implements ProblemService {
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

    @Autowired
    private AccountService accountService;

    @Autowired
    private CodeValidation codeValidation;

    @Autowired
    private ProblemValidation problemValidation;

    @Override
    @GraphQLQuery(name = "problemMetaData")
    public ProblemMetaDataDto getProblemMetaData() throws Exception {
        List<ProblemType> problemTypes = problemTypeRepository.findAll();
        List<ProblemLevel> problemLevels = problemLevelRepository.findAll();
        List<DataType> dataTypes = dataTypeRepository.findAll();
        List<Language> languages = languageRepository.findAll();
        ProblemMetaDataDto problemMetaDataDto = new ProblemMetaDataDto();
        problemMetaDataDto.setDataTypes(dataTypes);
        problemMetaDataDto.setLanguages(languages);
        problemMetaDataDto.setProblemLevels(problemLevels);
        problemMetaDataDto.setProblemTypes(problemTypes);
        return problemMetaDataDto;
    }

    @Override
    @GraphQLMutation(name = "registerOrUpdateProblem")
    public Problem registerOrUpdateProblem(RegisterOrUpdateProblemRequestDto request, boolean isUpdate)
            throws Exception {
        final Long problemId = request.getProblemId();
        User authenticatedUser = accountService.getAuthenticatedUser();
        if (isUpdate) {
            // 문제를 수정할 땐 문제를 만든 사람이 일치하는지 확인한다.
            boolean isCreator = problemRepository.existsByIdAndCreator(problemId, authenticatedUser);
            if (!isCreator)
                throw new Exception("You are not the creator of this problem.");
        }

        Optional<ProblemType> problemTypeOptional = problemTypeRepository.findById(request.getProblemTypeId());
        Optional<ProblemLevel> problemLevelOptional = problemLevelRepository.findById(request.getProblemLevelId());

        if (!problemTypeOptional.isPresent()) {
            throw new Exception("The problem type info is not correct");
        }
        if (!problemLevelOptional.isPresent()) {
            throw new Exception("The problem level info is not correct");
        }
        problemValidation.validateRegisterOrUpdateProblem(request);

        ProblemType problemType = problemTypeOptional.get();
        ProblemLevel problemLevel = problemLevelOptional.get();

        Problem problem = new Problem();
        if (isUpdate) {
            problem.setId(problemId);
            deleteParameterAndReturnAndTestcaseInfoBeforeUpdateTableInfo(problem);
        }
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
        createInitCodeAllOfLanguages(problem, authenticatedUser);
        return problem;
    }

    @GraphQLMutation(name = "deleteProblem")
    @Override
    public Problem deleteProblem(Long problemId) throws Exception {
        // 문제를 만든 사람이 삭제하려는 사람과 일치하는지 확인한다.
        User authenticatedUser = accountService.getAuthenticatedUser();
        boolean isCreator = problemRepository.existsByIdAndCreator(problemId, authenticatedUser);
        if (!isCreator)
            throw new Exception("You are not the creator of this problem.");
        Optional<Problem> problemOptional = problemRepository.findById(problemId);
        if (!problemOptional.isPresent())
            throw new Exception("The problem info is not correct.");
        Problem problem = problemOptional.get();
        problemRepository.delete(problem);
        return problem;
    }

    @GraphQLMutation(name = "submitProblemCode")
    @Override
    public Map<String, List<MarkResultDto>> submitProblemCode(Long problemId, Long languageId, String submittedCode)
            throws Exception {
        User authenticatedUser = accountService.getAuthenticatedUser();
        Optional<Language> languageOptional = languageRepository.findById(languageId);
        Optional<Problem> problemOptional = problemRepository.findById(problemId);
        if (!problemOptional.isPresent())
            throw new Exception("The problem info is not correct.");
        if (!languageOptional.isPresent())
            throw new Exception("The language info is not correct");
        final Language language = languageOptional.get();
        final Problem problem = problemOptional.get();

        submittedCode = decodeCode(submittedCode);
        codeValidation.validateSubmitProblemCode(submittedCode, language.getName());
        // 제출한 코드 먼저 저장
        Code code = saveCode(submittedCode, authenticatedUser, problem, language);

        // 코드 생성 및 채점
        List<MarkResultDto> exampleTableMarkResults = createValidateCodeAndMarkCode(submittedCode, problem, language,
                authenticatedUser, 'e');
        List<MarkResultDto> answerTableMarkResults = null;
        if (isMarkResultAnswer(exampleTableMarkResults)) { // 예시 테이블을 모두 만족할 경우에만 정답 테이블로 채점
            answerTableMarkResults = createValidateCodeAndMarkCode(submittedCode, problem, language, authenticatedUser,
                    'a');
            if (isMarkResultAnswer(answerTableMarkResults)) { // 정답 테이블을 모두 만족하면 solution 엔티티에 코드 저장
                saveSolution(code, authenticatedUser);
            }else{
                deleteSolutionIfNotAnswer(code, authenticatedUser);
            }
        }
        else{
            deleteSolutionIfNotAnswer(code, authenticatedUser);
        }
        Map<String, List<MarkResultDto>> results = new HashMap<>();
        results.put("exampleTableMarkResults", exampleTableMarkResults);
        results.put("answerTableMarkResults", answerTableMarkResults);

        return results;
    }

    private List<MarkResultDto> createValidateCodeAndMarkCode(String submittedCode, Problem problem, Language language,
            User authenticatedUser, char tableType) throws Exception {
        // 코드 생성 및 채점
        List<ProblemParameter> problemParameters = problemParameterRepository.findAllByProblemAndTableType(problem,
                tableType);
        ProblemReturn problemReturn = problemReturnRepository.findByProblemAndTableType(problem, tableType);
        List<ProblemTestcase> problemTestcases = problemTestcaseRepository.findAllByProblemAndTableType(problem,
                tableType);
        List<List<ProblemParameterValue>> parameterValues = new ArrayList<>();
        List<String> returnValues = new ArrayList<>();

        for (ProblemTestcase problemTestcase : problemTestcases) {
            List<ProblemParameterValue> problemParameterValues = problemParameterValueRepository
                    .findAllByProblemTestcase(problemTestcase);
            parameterValues.add(problemParameterValues);
            returnValues.add(problemTestcase.getReturnValue());
        }

        return markCode(submittedCode, problem, language, problemParameters, problemReturn, parameterValues,
                returnValues, authenticatedUser, tableType);
    }

    @GraphQLMutation(name = "resetCode")
    @Override
    public Code resetCode(Long problemId, Long languageId) throws Exception {
        // 코드 초기화시 코드 엔티티에 있는 내용 모두 삭제한다.
        // 코드 삭제하면 솔루션 또한 삭제된다(CASCADE).
        User authenticatedUser = accountService.getAuthenticatedUser();
        Optional<Language> languageOptional = languageRepository.findById(languageId);
        Optional<Problem> problemOptional = problemRepository.findById(problemId);
        if (!problemOptional.isPresent())
            throw new Exception("The problem info is not correct.");
        if (!languageOptional.isPresent())
            throw new Exception("The language info is not correct");
        final Language language = languageOptional.get();
        final Problem problem = problemOptional.get();
        Optional<Code> codeOptional = codeRepository.findByProblemAndLanguageAndCreatorAndIsInitCode(problem, language,
                authenticatedUser, false);
        Code code = null;
        if (codeOptional.isPresent()) {
            code = codeOptional.get();
            codeRepository.delete(code);
        }
        return code;
    }

    @GraphQLQuery(name = "userResolvedProblemCount")
    @Override
    public long getUserResolvedProblemCount() throws Exception {
        User authenticatedUser = accountService.getAuthenticatedUser();
        return solutionRepository.countProblemResolvedByCreator(authenticatedUser);
    }

    @GraphQLQuery(name = "problemList")
    @Override
    public Map<String, Object> getProblemList(List<Long> typeIds, List<Long> levelIds, Integer page) throws Exception {
        User authenticatedUser = accountService.getAuthenticatedUser();
        Map<String, Object> data = new HashMap<>();
        if (page <= 0) {
            throw new Exception("The page should > 0");
        }
        final int numberOfShow = 6;
        final PageRequest pageRequest = PageRequest.of(page - 1, numberOfShow);
        Page<Problem> problemPage;
        // filtering
        if (typeIds.isEmpty() && levelIds.isEmpty()) {
            problemPage = problemRepository.findAll(pageRequest);
        } else if (typeIds.isEmpty()) {
            problemPage = problemRepository.findAllByProblemLevelIdIn(levelIds, pageRequest);
        } else if (levelIds.isEmpty()) {
            problemPage = problemRepository.findAllByProblemTypeIdIn(typeIds, pageRequest);
        } else {
            problemPage = problemRepository.findAllByProblemTypeIdInAndProblemLevelIdIn(typeIds, levelIds, pageRequest);
        }

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
        data.put("problems", problemDtos);
        data.put("maxPage", problemPage.getTotalPages());
        return data;
    }

    /**
     * @param exceptAnswerTable   정답 테이블 정보 제외 여부
     * @param checkCreatorIsValid 문제 정보에 문제를 만든 사람만 접근할 수 있도록 함
     */
    @GraphQLQuery(name = "problemDetail")
    @Override
    public Map<String, Object> getProblemDetail(Long problemId, Boolean exceptAnswerTable, Boolean checkCreatorIsValid)
            throws Exception {
        Map<String, Object> problemData = new HashMap<>();
        final User authenticatedUser = accountService.getAuthenticatedUser();
        Optional<Problem> problemOptional;
        if (checkCreatorIsValid) {
            problemOptional = problemRepository.findByIdAndCreator(problemId, authenticatedUser);
            if (!problemOptional.isPresent())
                throw new Exception("The problem info is not correct or you are not creator of the problem.");
        } else {
            problemOptional = problemRepository.findById(problemId);
            if (!problemOptional.isPresent())
                throw new Exception("The problem info is not correct.");
        }

        Problem problem = problemOptional.get();
        ProblemDetailDto problemDetailDto = createProblemDataResponseDto(problem, exceptAnswerTable, problem.getCreator());
        problemData.put("problem", problemDetailDto);
        return problemData;
    }

    @GraphQLQuery(name = "problemCodes")
    @Override
    public Map<String, Object> getProblemCodes(Long problemId) throws Exception {
        Map<String, Object> problemCodes = new HashMap<>();
        User authenticatedUser = accountService.getAuthenticatedUser();
        Optional<Problem> problemOptional = problemRepository.findById(problemId);
        if (!problemOptional.isPresent())
            throw new Exception("The problem info is not correct");
        Problem problem = problemOptional.get();
        List<Language> languages = languageRepository.findAll();
        List<CodeDto> codeDtos = new ArrayList<>();
        for (Language language : languages) {
            CodeDto codeDto = new CodeDto();
            String prevCodeContent = null;
            String initCodeContent = null;
            Optional<Code> initCodeOptional = codeRepository.findByProblemAndLanguageAndCreatorAndIsInitCode(problem,
                    language, null, true);
            Optional<Code> prevCodeOptional = codeRepository.findByProblemAndLanguageAndCreatorAndIsInitCode(problem,
                    language, authenticatedUser, false);
            if (!initCodeOptional.isPresent()) {
                throw new Exception("The initial code info is empty.");
            } else {
                initCodeContent = initCodeOptional.get().getContent();
            }
            if (prevCodeOptional.isPresent()) {
                prevCodeContent = prevCodeOptional.get().getContent();
            }
            codeDto.setInitCode(initCodeContent);
            codeDto.setPrevCode(prevCodeContent);
            LanguageDto languageDto = new LanguageDto();
            languageDto.setId(language.getId());
            languageDto.setName(language.getName());
            codeDto.setLanguage(languageDto);
            codeDtos.add(codeDto);
        }
        problemCodes.put("codes", codeDtos);
        return problemCodes;
    }

    private void createInitCodeAllOfLanguages(Problem problem, User authenticatedUser) {
        List<Language> languages = languageRepository.findAll();
        for (Language language : languages) {
            String initCodeContent = null;
            List<ProblemParameter> problemParameters = problemParameterRepository.findAllByProblemAndTableType(problem,
                    'a');
            ProblemReturn problemReturn = problemReturnRepository.findByProblemAndTableType(problem, 'a');
            initCodeContent = codeGenerateManager.makeInitCode(problemParameters, problemReturn, language);
            Optional<Code> prevInitCodeOptional = codeRepository
                    .findByProblemAndLanguageAndCreatorAndIsInitCode(problem, language, null, true);
            
            
            List<Code> prevCodes = codeRepository.findAllByProblemAndLanguageAndIsInitCode(problem,language,false);
            Code initCode;
            if (prevInitCodeOptional.isPresent()) {
                initCode = prevInitCodeOptional.get();
            } else {
                initCode = new Code();
                initCode.setCreator(null);
                initCode.setLanguage(language);
                initCode.setProblem(problem);
                initCode.setIsInitCode(true);
            }

            // 이전에 사용자들이 작성한 코드들은 모두 삭제
            codeRepository.deleteAll(prevCodes);
            initCode.setContent(initCodeContent);
            codeRepository.save(initCode);
        }
    }

    private void deleteParameterAndReturnAndTestcaseInfoBeforeUpdateTableInfo(Problem problem) {
        List<ProblemParameter> previousProblemParameters = problemParameterRepository.findAllByProblem(problem);
        for (ProblemParameter previousProblemParameter : previousProblemParameters) {
            problemParameterRepository.delete(previousProblemParameter);
        }
        List<ProblemReturn> previousProblemReturns = problemReturnRepository.findAllByProblem(problem);
        for (ProblemReturn previousProblemReturn : previousProblemReturns) {
            problemReturnRepository.delete(previousProblemReturn);
        }
        List<ProblemTestcase> previousProblemTestcases = problemTestcaseRepository.findAllByProblem(problem);
        for (ProblemTestcase previousProblemTestcase : previousProblemTestcases) {
            List<ProblemParameterValue> previosProblemParameterValues = problemParameterValueRepository
                    .findAllByProblemTestcase(previousProblemTestcase);
            for (ProblemParameterValue previousProblemParameterValue : previosProblemParameterValues) {
                problemParameterValueRepository.delete(previousProblemParameterValue);
            }
            problemTestcaseRepository.delete(previousProblemTestcase);
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

    private String decodeCode(String submittedCode) throws UnsupportedEncodingException {
        submittedCode = URLDecoder.decode(submittedCode, "UTF-8");
        submittedCode = submittedCode.replaceAll("(\\$)plus;", "+");
        return submittedCode;
    }

    private List<MarkResultDto> markCode(String submittedCode, Problem problem, Language language,
            List<ProblemParameter> problemParameters, ProblemReturn problemReturn,
            List<List<ProblemParameterValue>> parameterValues, List<String> returnValues, User authenticatedUser,
            char tableType) throws Exception {
        List<MarkResultDto> markResults = new ArrayList<>();

        // 코드 생성
        // 채점 및 채점 결과 생성
        if (StringUtils.isEmpty(submittedCode)) {
            throw new Exception("The submitted code is empty");
        }
        String languageName = language.getName();
        final int testcaseSize = parameterValues.size();
        final int timeLimit = problem.getTimeLimit();
        final int memoryLimit = problem.getMemoryLimit();
        CompileErrorDto compileErrorDto = new CompileErrorDto();
        String fullCode = "";
        switch(languageName){
            case "java":
                fullCode = compileManager.makeJavaFullCode(submittedCode);
                break;
            case "python3":
                fullCode = compileManager.makePythonFullCode(submittedCode);
                break;
            case "cpp":
                fullCode = submittedCode;
                break;
        }

        for (int idx = 0; idx < testcaseSize; idx++) {
            List<ProblemParameterValue> problemParameterValues = parameterValues.get(idx);
            String returnValue = returnValues.get(idx);
            CompileOption compileOption = compileManager.makeCompileOption(problemParameters, problemReturn,
                    problemParameterValues, returnValue, timeLimit, fullCode, memoryLimit, language);

            final int testcaseNumber = idx + 1;
            MarkResultDto markResultDto = null;
            switch (languageName) {
                case "java":
                markResultDto = compileManager.compileJava(compileOption, compileErrorDto);
                    break;
                case "python3":
                markResultDto =compileManager.compilePython(compileOption, compileErrorDto);
                    break;
                case "cpp":
                markResultDto = compileManager.compileCpp(compileOption, compileErrorDto);
                    break;
            }
            if(markResultDto == null || compileErrorDto.isCompileError()){
                throw new Exception("An error occured while compile");
            }

            markResultDto.setTestcaseNumber(testcaseNumber);
            markResults.add(markResultDto);
            Thread.sleep(10);
        }
        if (markResults.size() != testcaseSize) {
            throw new Exception("An error occured when marking the codes");
        }
        return markResults;
    }

    private boolean isMarkResultAnswer(List<MarkResultDto> markResults) {
        return markResults.stream().allMatch(result -> result.getIsAnswer());
    }

    private Code saveCode(String submittedCode, User authenticatedUser, Problem problem, Language language) {
        // 정답이든 아니든 code 엔티티에 저장(코드 저장)
        Optional<Code> codeOptional = codeRepository.findByProblemAndLanguageAndCreatorAndIsInitCode(problem, language,
                authenticatedUser, false);
        Code code = null;
        // 이전에 작성한 코드가 있으면 덮어쓴다.
        if (codeOptional.isPresent()) {
            code = codeOptional.get();
        } else {
            code = new Code();
            code.setProblem(problem);
            code.setLanguage(language);
            code.setIsInitCode(false);
        }
        code.setContent(submittedCode);
        code.setCreator(authenticatedUser);
        codeRepository.save(code);
        return code;
    }

    // 정답일 경우 solution 엔티티에 저장
    private void saveSolution(Code code, User authenticatedUser) {
        Optional<Solution> solutionOptional = solutionRepository.findByCode(code);
        Solution solution = null;
        // 이전에 작성된 솔루션이 있으면 덮어쓴다.
        if (solutionOptional.isPresent()) {
            solution = solutionOptional.get();
            if (!solution.getCreator().getId().equals(authenticatedUser.getId()))
                return;
        } else {
            solution = new Solution();
            solution.setProblem(code.getProblem());
            solution.setCreator(authenticatedUser);
        }
        solution.setCode(code);
        solutionRepository.save(solution);
    }

    // 정답이 아닐 경우 code에 연결된 솔루션 삭제(코드가 수정되어도 솔루션은 그대로 있다)
    private void deleteSolutionIfNotAnswer(Code code, User authenticatedUser){
        Optional<Solution> solutionOptional = solutionRepository.findByCode(code);
        if (solutionOptional.isPresent()) {
            Solution solution = solutionOptional.get();
            if (solution.getCreator().getId().equals(authenticatedUser.getId()))
            {
                solutionRepository.delete(solution);
            }
        }
    }

    private ProblemDetailDto createProblemDataResponseDto(Problem problem, Boolean exceptAnswerTable, User creator) {
        ProblemDetailDto response = new ProblemDetailDto();
        response.setId(problem.getId());
        response.setTitle(problem.getTitle());
        ProblemTypeDto problemTypeDto = new ProblemTypeDto();
        ProblemType problemType = problem.getProblemType();
        problemTypeDto.setId(problemType.getId());
        problemTypeDto.setName(problemType.getName());
        response.setProblemType(problemTypeDto);
        response.setLimitExplain(problem.getLimitExplain());
        ProblemLevel problemLevel = problem.getProblemLevel();
        ProblemLevelDto problemLevelDto = new ProblemLevelDto();
        problemLevelDto.setId(problemLevel.getId());
        problemLevelDto.setName(problemLevel.getName());
        response.setLevel(problemLevelDto);
        response.setTimeLimit(problem.getTimeLimit());
        response.setMemoryLimit(problem.getMemoryLimit());
        response.setExplain(problem.getContent());
        InputOutputTableDto exampleTable = createInputOutputTableDto(problem, 'e');
        response.setExampleTable(exampleTable);
        UserRequestDto userDto = new UserRequestDto();
        userDto.setId(creator.getId());
        userDto.setNickname(creator.getNickname());
        response.setCreator(userDto);
        if (!exceptAnswerTable) {
            InputOutputTableDto answerTable = createInputOutputTableDto(problem, 'a');
            response.setAnswerTable(answerTable);
        }
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
            DataType paramDataType = problemParameter.getDataType();
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