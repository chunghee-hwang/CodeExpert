package com.goodperson.code.expert.service;

import java.util.List;
import java.util.Map;

import com.goodperson.code.expert.dto.MarkResultDto;
import com.goodperson.code.expert.dto.ProblemMetaDataDto;
import com.goodperson.code.expert.dto.RegisterOrUpdateProblemRequestDto;
import com.goodperson.code.expert.model.Problem;

public interface ProblemService {
        ProblemMetaDataDto getProblemMetaData() throws Exception;
        
        Problem registerOrUpdateProblem(RegisterOrUpdateProblemRequestDto request, boolean isUpdate) throws Exception;

        Problem deleteProblem(Long problemId) throws Exception;

        List<MarkResultDto> submitProblemCode(Long problemId, Long languageId, String code) throws Exception;

        void resetCode(Long problemId, Long languageId) throws Exception;

        long getUserResolvedProblemCount() throws Exception;

        Map<String, Object> getProblemList(List<Long> typeIds, List<Long> levelIds, Integer page) throws Exception;

        Map<String, Object> getProblemDetail(Long problemId) throws Exception;
        Map<String, Object> getProblemCodes(Long problemId) throws Exception;

}