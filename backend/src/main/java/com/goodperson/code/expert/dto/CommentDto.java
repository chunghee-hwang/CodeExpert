package com.goodperson.code.expert.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class CommentDto implements Serializable {
    private static final long serialVersionUID = 8918839269017886220L;
    private Long id;
    private UserDto user;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private String content;
}
