package com.goodperson.code.expert.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@Table(name = "user")
public class User extends BaseTimeEntity {
    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, unique = true, length = 45)
    private String email;

    @Column(nullable = false, length = 30)
    private String password;

    // 영어가 아닌 글자 입력시 unescape 함수로 한글이 변환되서 넘어오기 때문에 6(인코딩된 한 글자 길이)X15(닉네임 최대 길이)로
    // 설정
    @Column(nullable = false, unique = true, length = 90)
    private String nickname;

    @Column(nullable = false, length = 5)
    private String role;
}