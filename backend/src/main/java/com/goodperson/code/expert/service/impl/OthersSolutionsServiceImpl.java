package com.goodperson.code.expert.service.impl;

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
import com.goodperson.code.expert.dto.UserDto;
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
import com.goodperson.code.expert.service.OthersSolutionsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class OthersSolutionsServiceImpl implements OthersSolutionsService {
    @Autowired
    private SolutionRepository solutionRepository;
    @Autowired
    private SolutionCommentRepository solutionCommentRepository;

    @Autowired
    private SolutionLikeUserInfoRepository solutionLikeUserInfoRepository;

    @Autowired
    private LanguageRepository languageRepository;
    @Autowired
    private ProblemRepository problemRepository;

    @Override
    public OthersSolutionsDto getOthersSolutions(Long problemId, Long languageId, Integer page, User authenticatedUser)
            throws Exception {
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
                solutionAndLikeCountsPage.getTotalPages(), problem, authenticatedUser);
        return othersSolutionsDto;
    }

    @Override
    public Map<String, Object> registerComment(Long solutionId, String commentContent, User authenticatedUser)
            throws Exception {
        Map<String, Object> data = new HashMap<>();
        Optional<Solution> solutionOptional = solutionRepository.findById(solutionId);
        if (!solutionOptional.isPresent())
            throw new Exception("The solution info is not correct");
        SolutionComment solutionComment = new SolutionComment();
        solutionComment.setContent(commentContent);
        solutionComment.setSolution(solutionOptional.get());
        solutionComment.setWriter(authenticatedUser);
        solutionCommentRepository.save(solutionComment);
        data.put("solutionId", solutionComment.getSolution().getId());
        data.put("comment", convertSolutionCommentToDto(solutionComment));
        return data;
    }

    @Override
    public Map<String, Object> updateComment(Long commentId, String commentContent, User authenticatedUser)
            throws Exception {
        Map<String, Object> data = new HashMap<>();
        Optional<SolutionComment> solutionCommentOptional = solutionCommentRepository.findById(commentId);
        if (!solutionCommentOptional.isPresent())
            throw new Exception("The comment info is not correct");
        SolutionComment solutionComment = solutionCommentOptional.get();
        if (solutionComment.getWriter().getId() != authenticatedUser.getId())
            throw new Exception("You are not the writer of the comment");
        solutionComment.setContent(commentContent);
        solutionCommentRepository.save(solutionComment);
        data.put("solutionId", solutionComment.getSolution().getId());
        data.put("comment", convertSolutionCommentToDto(solutionComment));
        return data;
    }

    @Override
    public Map<String, Object> deleteComment(Long commentId, User authenticatedUser) throws Exception {
        Map<String, Object> data = new HashMap<>();
        Optional<SolutionComment> solutionCommentOptional = solutionCommentRepository.findById(commentId);
        if (!solutionCommentOptional.isPresent())
            throw new Exception("The comment info is not correct");
        SolutionComment solutionComment = solutionCommentOptional.get();
        if (solutionComment.getWriter().getId() != authenticatedUser.getId())
            throw new Exception("You are not the writer of the comment");
        solutionCommentRepository.delete(solutionComment);
        data.put("solutionId", solutionComment.getSolution().getId());
        data.put("comment", convertSolutionCommentToDto(solutionComment));
        return data;
    }

    @Override
    public Map<String, Object> likeOrCancelLike(Long solutionId, User authenticatedUser) throws Exception {
        Map<String, Object> data = new HashMap<>();
        Optional<Solution> solutionOptional = solutionRepository.findById(solutionId);
        if (!solutionOptional.isPresent())
            throw new Exception("The solution info is not correct");
        Solution likeSolution = solutionOptional.get();
        long likeCount = solutionLikeUserInfoRepository.countByLikeSolution(likeSolution); // 좋아요 누르기 전 개수 가져오기
        data.put("solutionId", likeSolution.getId());
        data.put("likes", getLikesDto(likeSolution, likeCount, authenticatedUser, false));
        return data;
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

    private LanguageDto convertLanguageToDto(Language language) {
        LanguageDto languageDto = new LanguageDto();
        languageDto.setId(language.getId());
        languageDto.setName(language.getName());
        return languageDto;
    }

    private UserDto convertUserToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setNickname(user.getNickname());
        return userDto;
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

    private List<CommentDto> getCommentDtoList(Solution solution) {
        List<SolutionComment> solutionComments = solutionCommentRepository.findAllBySolution(solution);
        List<CommentDto> commentDtos = solutionComments.stream()
                .map(solutionComment -> convertSolutionCommentToDto(solutionComment)).collect(Collectors.toList());
        return commentDtos;
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
}