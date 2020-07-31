package com.goodperson.code.expert.service;

import java.util.Map;

import com.goodperson.code.expert.dto.OthersSolutionsDto;
import com.goodperson.code.expert.model.User;

public interface OthersSolutionsService {
    OthersSolutionsDto getOthersSolutions(Long problemId, Long languageId, Integer page, User authenticatedUser)
            throws Exception;

    Map<String, Object> registerComment(Long solutionId, String commentContent, User authenticatedUser)
            throws Exception;

    Map<String, Object> updateComment(Long commentId, String commentContent, User authenticatedUser) throws Exception;

    Map<String, Object> deleteComment(Long commentId, User authenticatedUser) throws Exception;

    Map<String, Object> likeOrCancelLike(Long solutionId, User authenticatedUser) throws Exception;
}