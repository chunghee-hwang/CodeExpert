package com.goodperson.code.expert.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class SolutionDto implements Serializable {
    private static final long serialVersionUID = 6060021517391498570L;

    private Long id;
    private UserDto user;
    private String code;
    private LanguageDto language;
    private LikesDto likes;
    private List<CommentDto> comments;
}
