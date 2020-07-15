package com.goodperson.code.expert.repository;

import com.goodperson.code.expert.model.Problem;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemRepository extends JpaRepository<Problem, Long> {

}