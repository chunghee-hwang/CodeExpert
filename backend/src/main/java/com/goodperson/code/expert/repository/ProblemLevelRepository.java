package com.goodperson.code.expert.repository;

import com.goodperson.code.expert.model.ProblemLevel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemLevelRepository extends JpaRepository<ProblemLevel, Long> {

}