package com.goodperson.code.expert.service;

import java.util.Map;

import com.goodperson.code.expert.dto.OthersSolutionsDto;

public interface OthersSolutionsService {
    OthersSolutionsDto getOthersSolutions(Long problemId, Long languageId, Integer page)
            throws Exception;

    Map<String, Object> registerComment(Long solutionId, String commentContent)
            throws Exception;

    Map<String, Object> updateComment(Long commentId, String commentContent) throws Exception;

    Map<String, Object> deleteComment(Long commentId) throws Exception;

    Map<String, Object> likeOrCancelLike(Long solutionId) throws Exception;
}