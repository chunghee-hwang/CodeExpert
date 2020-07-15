package com.goodperson.code.expert.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@EntityListeners(AuditingEntityListener.class)
public class ProblemImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String fileName;

    @Column(nullable = false, length = 4000)
    private String saveFileName;

    @Column(nullable = false, length = 10)
    private String contentType;

    @CreatedDate
    @Column(nullable = false)
    private String createdDate;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;
}