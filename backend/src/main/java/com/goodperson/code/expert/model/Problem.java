package com.goodperson.code.expert.model;

import java.time.LocalDateTime;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, columnDefinition="LONGTEXT")
    private String content;

    @Column(nullable = false, length = 200)
    private String limitExplain;

    @Column(nullable = false, columnDefinition = "MEDIUMINT", length = 5)
    private Integer timeLimit;

    @Column(nullable = false, columnDefinition = "MEDIUMINT", length = 3)
    private Integer memoryLimit;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    private LocalDateTime modifiedDate;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "problem_level_id", nullable = true)
    private ProblemLevel problemLevel;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "problem_type_id", nullable = true)
    private ProblemType problemType;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "creator_id", nullable = true)
    private User creator;
}