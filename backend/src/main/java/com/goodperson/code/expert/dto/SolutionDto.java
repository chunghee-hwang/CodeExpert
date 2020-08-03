package com.goodperson.code.expert.dto;

import java.util.List;

import lombok.Data;

@Data
public class SolutionDto {
    private Long id;
    private UserRequestDto user;
    private String code;
    private LanguageDto language;
    private LikesDto likes;
    private List<CommentDto> comments;
}
