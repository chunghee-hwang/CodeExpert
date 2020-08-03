package com.goodperson.code.expert.service.impl;

import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Consumer;

import com.goodperson.code.expert.dto.CodeDto;
import com.goodperson.code.expert.dto.DataTypeDto;
import com.goodperson.code.expert.dto.InputOutputTableDto;
import com.goodperson.code.expert.dto.LanguageDto;
import com.goodperson.code.expert.dto.MarkResultDto;
import com.goodperson.code.expert.dto.ParameterDto;
import com.goodperson.code.expert.dto.ProblemDataResponseDto;
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
import com.goodperson.code.expert.service.AccountService;
import com.goodperson.code.expert.service.ProblemService;
import com.goodperson.code.expert.utils.CodeGenerateManager;
import com.goodperson.code.expert.utils.CompileManager;
import com.goodperson.code.expert.utils.CompileOption;
import com.goodperson.code.expert.utils.FileUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
    private ProblemImageRepository problemImageRepository;

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
    private FileUtils fileUtils;

    @Autowired
    private AccountService accountService;


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
        ProblemType problemType = problemTypeOptional.get();
        ProblemLevel problemLevel = problemLevelOptional.get();

        Problem problem = new Problem();
        if(isUpdate){
            problem.setId(problemId);
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
        return problem;
    }

    @Override
    public List<String> uploadProblemImage(MultipartFile[] files) throws Exception {
        List<String> urls = new ArrayList<>();
        File uploadedDirectory = fileUtils.getImageUploadDirectory();
        for (MultipartFile multipartFile : files) {
            String originalFileName = multipartFile.getOriginalFilename();
            String savedFileName = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME) + fileUtils.getFileExtension(originalFileName);
            String matchedContentType = fileUtils.getContentTypeFromFileName(originalFileName);
            Optional<ProblemImage> sameFileNameProblemImageOptional = problemImageRepository
                    .findBySavedFileName(savedFileName);
            if (sameFileNameProblemImageOptional.isPresent()) {
                savedFileName = fileUtils
                        .getUniqueSaveFileName(sameFileNameProblemImageOptional.get().getSavedFileName());
            }
            if (!matchedContentType.startsWith("image/"))
                throw new Exception("The file(s) is(are) not image format.");

            ProblemImage problemImage = new ProblemImage();
            problemImage.setContentType(matchedContentType);
            problemImage.setFileName(originalFileName);
            problemImage.setSavedFileName(savedFileName);
            problemImageRepository.save(problemImage);
            File savedFile = new File(uploadedDirectory, savedFileName);
            multipartFile.transferTo(savedFile); // 파일 서버에 저장
            urls.add("/images/"+savedFileName);
        }
        return urls;
    }

    @Override
    public void deleteProblem(Long problemId) throws Exception {
        // 문제를 만든 사람이 삭제하려는 사람과 일치하는지 확인한다.
        User authenticatedUser = accountService.getAuthenticatedUser();
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

    @Override
    public List<MarkResultDto> submitProblemCode(Long problemId, Long languageId, String submittedCode)
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
        return markResultDtos;
    }

    @Override
    public void resetCode(Long problemId, Long languageId) throws Exception {
        // 코드 초기화시 솔루션과 코드 엔티티에 있는 내용 모두 삭제한다.
        // 코드 삭제하면 솔루션도 cascade로 삭제된다.
        User authenticatedUser = accountService.getAuthenticatedUser();
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

    @GraphQLQuery(name="userResolvedProblemCount")
    @Override
    public long getUserResolvedProblemCount() throws Exception {
        User authenticatedUser = accountService.getAuthenticatedUser();
        return solutionRepository.countProblemResolvedByCreator(authenticatedUser);
    }

    @Override
    public Map<String, Object> getProblemList(List<Long> typeIds, List<Long> levelIds, Integer page) throws Exception {
        User authenticatedUser = accountService.getAuthenticatedUser();
        Map<String, Object> data = new HashMap<>();
        final String initValue = "";
        if (page <= 0) {
            throw new Exception("The page should > 0");
        }
        final int numberOfShow = 5;
        Page<Problem> problemPage = problemRepository.findAllByProblemTypeIdInOrProblemLevelIdInAndContentNot(typeIds,
                levelIds, initValue, PageRequest.of(page - 1, numberOfShow));
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
        data.put("problems", problemDtos);
        data.put("maxPage", problemPage.getTotalPages());
        return data;
    }

    @Override
    public Map<String, Object> getProblemDataAndCode(Long problemId) throws Exception {
        Map<String, Object> data = new HashMap<>();
        User authenticatedUser = accountService.getAuthenticatedUser();
        Optional<Problem> problemOptional = problemRepository.findById(problemId);
        if (!problemOptional.isPresent())
            throw new Exception("The problem info is not correct");
        Problem problem = problemOptional.get();
        ProblemDataResponseDto ProblemDataResponseDto = createProblemDataResponseDto(problem, authenticatedUser);

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
            initCodeContent = codeGenerateManager.makeInitCode(problemParameters, problemReturn, language);

            codeDto.setInitCode(initCodeContent);
            codeDto.setPrevCode(prevCodeContent);
            LanguageDto languageDto = new LanguageDto();
            languageDto.setId(language.getId());
            languageDto.setName(language.getName());
            codeDto.setLanguage(languageDto);
            codeDtos.add(codeDto);
        }

        data.put("problem", ProblemDataResponseDto);
        data.put("codes", codeDtos);
        return null;
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

    private List<MarkResultDto> markCode(String submittedCode, Problem problem, Language language,
            List<ProblemParameter> problemParameters, ProblemReturn problemReturn,
            List<List<ProblemParameterValue>> parameterValues, List<String> returnValues, User authenticatedUser)
            throws Exception {
        List<MarkResultDto> markResults = new ArrayList<>();

        // 코드 생성
        // 채점 및 채점 결과 생성
        String languageName = language.getName();
        final int testcaseSize = parameterValues.size();

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
                    compileManager.compileJava(submittedCode, compileOption).thenAccept(resultHandler);
                    break;
                case "python3":
                    compileManager.compilePython(submittedCode, compileOption).thenAccept(resultHandler);
                    break;
                case "cpp":
                    compileManager.compileCpp(submittedCode, compileOption).thenAccept(resultHandler);
                    break;
            }
            Thread.sleep(10);
        }

        /** Busy waiting */
        // waitForAllTestcasesMarked(testcaseSize, markResults).get();
        while (markResults.size() != testcaseSize) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException ie) {
                break;
            }
        }
        if (markResults.size() == testcaseSize) {
            saveCodeMarkResult(markResults, submittedCode, authenticatedUser, problem, language);
        } else {
            throw new Exception("An error occured when marking the codes");
        }
        return markResults;
    }

    private void saveCodeMarkResult(List<MarkResultDto> results, String submittedCode, User authenticatedUser,
            Problem problem, Language language) {
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

    private ProblemDataResponseDto createProblemDataResponseDto(Problem problem, User creator) {
        ProblemDataResponseDto response = new ProblemDataResponseDto();
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