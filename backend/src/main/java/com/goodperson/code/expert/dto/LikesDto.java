package com.goodperson.code.expert.dto;

import java.io.Serializable;

import lombok.Data;

@Data
public class LikesDto implements Serializable {
    private static final long serialVersionUID = 2245225975126158236L;
    private Long likeCount;
    private Boolean isLikePressed;
}
