package com.goodperson.code.expert;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.goodperson.code.expert.dto.CommentDto;
import com.goodperson.code.expert.dto.LanguageDto;
import com.goodperson.code.expert.dto.LikesDto;
import com.goodperson.code.expert.dto.OthersSolutionsDto;
import com.goodperson.code.expert.dto.ProblemDto;
import com.goodperson.code.expert.dto.SolutionDto;
import com.goodperson.code.expert.dto.UserRequestDto;
import com.goodperson.code.expert.model.Code;
import com.goodperson.code.expert.model.Language;
import com.goodperson.code.expert.model.Problem;
import com.goodperson.code.expert.model.Solution;
import com.goodperson.code.expert.model.SolutionComment;
import com.goodperson.code.expert.model.SolutionLikeUserInfo;
import com.goodperson.code.expert.model.User;
import com.goodperson.code.expert.repository.LanguageRepository;
import com.goodperson.code.expert.repository.ProblemRepository;
import com.goodperson.code.expert.repository.SolutionCommentRepository;
import com.goodperson.code.expert.repository.SolutionLikeUserInfoRepository;
import com.goodperson.code.expert.repository.SolutionRepository;
import com.goodperson.code.expert.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@SpringBootTest
public class SolutionApiTest {
    @Autowired
    private SolutionRepository solutionRepository;
    @Autowired
    private SolutionCommentRepository solutionCommentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SolutionLikeUserInfoRepository solutionLikeUserInfoRepository;

    @Autowired
    private LanguageRepository languageRepository;
    @Autowired
    private ProblemRepository problemRepository;

    @BeforeEach
    public void executeBeforeTest() throws Exception {
    }

    private User getAuthenticatedUser(Long userId) {
        // 로그인되어있는 유저 정보
        return userRepository.findById(userId).get();
    }

    @Test
    public void testGetOtherSolutions() throws Exception {
        final Long problemId = 1L;
        final Long languageId = 1L;
        final int page = 1;
        final int numberOfShow = 5;
        Optional<Problem> problemOptional = problemRepository.findById(problemId);
        if (!problemOptional.isPresent())
            throw new Exception("The problem info is not correct");
        Optional<Language> languageOptional = languageRepository.findById(languageId);
        if (!languageOptional.isPresent())
            throw new Exception("The language info is not correct");

        Problem problem = problemOptional.get();
        Language language = languageOptional.get();
        Page<Object[]> solutionAndLikeCountsPage = solutionRepository.findAllSolutionAndLikeCountByProblemAndLanguage(
                language, problem, PageRequest.of(page - 1, numberOfShow), Sort.by("likeCount").descending());
        System.out.println(solutionAndLikeCountsPage);
        List<Object[]> solutionAndLikeCounts = solutionAndLikeCountsPage.getContent();
        OthersSolutionsDto othersSolutionsDto = convertSolutionsToOtherSolutionsDto(solutionAndLikeCounts,
                solutionAndLikeCountsPage.getTotalPages(), problem, getAuthenticatedUser(1L));
        System.out.println(othersSolutionsDto);
    }

    private OthersSolutionsDto convertSolutionsToOtherSolutionsDto(List<Object[]> solutionAndLikeCounts, int totalPages,
            Problem problem, User authenticatedUser) {
        OthersSolutionsDto othersSolutionsDto = new OthersSolutionsDto();

        ProblemDto problemDto = new ProblemDto();
        problemDto.setId(problem.getId());
        problemDto.setTitle(problem.getTitle());

        List<SolutionDto> solutionDtos = new ArrayList<>();
        for (Object[] solutionAndLikeCount : solutionAndLikeCounts) {
            Solution solution = (Solution) solutionAndLikeCount[0];
            Long likeCount = (Long) solutionAndLikeCount[1];
            SolutionDto solutionDto = new SolutionDto();
            solutionDto.setId(solution.getId());
            Code code = solution.getCode();
            solutionDto.setCode(code.getContent());
            solutionDto.setLanguage(convertLanguageToDto(code.getLanguage()));
            solutionDto.setUser(convertUserToDto(solution.getCreator()));
            solutionDto.setLikes(getLikesDto(solution, likeCount, authenticatedUser, true));
            solutionDto.setComments(getCommentDtoList(solution));
            solutionDtos.add(solutionDto);
        }

        othersSolutionsDto.setMaxPageNumber(totalPages);
        othersSolutionsDto.setProblem(problemDto);
        othersSolutionsDto.setSolutions(solutionDtos);
        return othersSolutionsDto;
    }

    private List<CommentDto> getCommentDtoList(Solution solution) {
        List<SolutionComment> solutionComments = solutionCommentRepository.findAllBySolution(solution);
        List<CommentDto> commentDtos = solutionComments.stream()
                .map(solutionComment -> convertSolutionCommentToDto(solutionComment)).collect(Collectors.toList());
        return commentDtos;
    }

    private LanguageDto convertLanguageToDto(Language language) {
        LanguageDto languageDto = new LanguageDto();
        languageDto.setId(language.getId());
        languageDto.setName(language.getName());
        return languageDto;
    }

    private UserRequestDto convertUserToDto(User user) {
        UserRequestDto userDto = new UserRequestDto();
        userDto.setId(user.getId());
        userDto.setNickname(user.getNickname());
        return userDto;
    }

    @Test
    public void testRegisterComment() throws Exception {
        final String commentContent = "정말 멋지네요!";
        final Long solutionId = 1L;
        User writer = getAuthenticatedUser(1L);
        Optional<Solution> solutionOptional = solutionRepository.findById(solutionId);
        if (!solutionOptional.isPresent())
            throw new Exception("The solution info is not correct");
        SolutionComment solutionComment = new SolutionComment();
        solutionComment.setContent(commentContent);
        solutionComment.setSolution(solutionOptional.get());
        solutionComment.setWriter(writer);
        solutionCommentRepository.save(solutionComment);
        Map<String, Object> response = new HashMap<>();
        response.put("solutionId", solutionComment.getSolution().getId());
        response.put("comment", convertSolutionCommentToDto(solutionComment));
    }

    private CommentDto convertSolutionCommentToDto(SolutionComment solutionComment) {
        CommentDto commentDto = new CommentDto();
        commentDto.setId(solutionComment.getId());
        commentDto.setContent(solutionComment.getContent());
        commentDto.setCreatedDate(solutionComment.getCreatedDate());
        commentDto.setModifiedDate(solutionComment.getModifiedDate());
        User user = solutionComment.getWriter();
        commentDto.setUser(convertUserToDto(user));
        return commentDto;
    }

    @Test
    public void testUpdateComment() throws Exception {
        final Long commentId = 1L;
        final String commentContent = "수정한 댓글입니다.";
        User writer = getAuthenticatedUser(1L);
        Optional<SolutionComment> solutionCommentOptional = solutionCommentRepository.findById(commentId);
        if (!solutionCommentOptional.isPresent())
            throw new Exception("The comment info is not correct");
        SolutionComment solutionComment = solutionCommentOptional.get();
        if (solutionComment.getWriter().getId() != writer.getId())
            throw new Exception("You are not the writer of the comment");
        solutionComment.setContent(commentContent);
        solutionCommentRepository.save(solutionComment);
        Map<String, Object> response = new HashMap<>();
        response.put("solutionId", solutionComment.getSolution().getId());
        response.put("comment", convertSolutionCommentToDto(solutionComment));
    }

    @Test
    public void testDeleteComment() throws Exception {
        final Long commentId = 1L;
        User writer = getAuthenticatedUser(1L);
        Optional<SolutionComment> solutionCommentOptional = solutionCommentRepository.findById(commentId);
        if (!solutionCommentOptional.isPresent())
            throw new Exception("The comment info is not correct");
        SolutionComment solutionComment = solutionCommentOptional.get();
        if (solutionComment.getWriter().getId() != writer.getId())
            throw new Exception("You are not the writer of the comment");
        solutionCommentRepository.delete(solutionComment);
        System.out.println(solutionComment);
        Map<String, Object> response = new HashMap<>();
        response.put("solutionId", solutionComment.getSolution().getId());
        response.put("comment", convertSolutionCommentToDto(solutionComment));
    }

    @Test
    public void testLikeOrCancelLike() throws Exception {
        final Long solutionId = 5L;
        User likeUser = getAuthenticatedUser(2L);
        Optional<Solution> solutionOptional = solutionRepository.findById(solutionId);
        if (!solutionOptional.isPresent())
            throw new Exception("The solution info is not correct");
        Solution likeSolution = solutionOptional.get();

        Map<String, Object> response = new HashMap<>();
        long likeCount = solutionLikeUserInfoRepository.countByLikeSolution(likeSolution); // 좋아요 누르기 전 개수 가져오기
        response.put("solutionId", likeSolution.getId());
        response.put("likes", getLikesDto(likeSolution, likeCount, likeUser, false));
        System.out.println(response);
    }

    // likeCountBeforePressed: 좋아요 버튼을 누르기 전 좋아요 개수, isLikeReadonly: 좋아요 수 수정 가능 여부
    private LikesDto getLikesDto(Solution likeSolution, Long likeCountBeforePressed, User likeUser,
            boolean isLikeReadonly) {
        LikesDto likesDto = new LikesDto();
        Optional<SolutionLikeUserInfo> likeUserInfoOptional = solutionLikeUserInfoRepository
                .findByLikeSolutionAndLikeUser(likeSolution, likeUser);
        boolean isLikePressed;
        // 좋아요가 눌려있다면
        if (likeUserInfoOptional.isPresent()) {
            // 좋아요 삭제
            if (isLikeReadonly) {
                isLikePressed = true;
            } else {
                solutionLikeUserInfoRepository.delete(likeUserInfoOptional.get());
                isLikePressed = false;
            }
        }
        // 좋아요가 안 눌려있다면
        else {
            if (isLikeReadonly) {
                isLikePressed = false;
            } else {
                // 좋아요 등록
                SolutionLikeUserInfo likeUserInfo = new SolutionLikeUserInfo();
                likeUserInfo.setLikeSolution(likeSolution);
                likeUserInfo.setLikeUser(likeUser);
                solutionLikeUserInfoRepository.save(likeUserInfo);
                isLikePressed = true;
            }

        }
        if (!isLikeReadonly) {
            if (isLikePressed)
                likeCountBeforePressed += 1;
            else
                likeCountBeforePressed -= 1;
        }
        likesDto.setIsLikePressed(isLikePressed);
        likesDto.setLikeCount(likeCountBeforePressed);
        return likesDto;
    }
}