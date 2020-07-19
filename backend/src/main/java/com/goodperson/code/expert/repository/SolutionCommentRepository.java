package com.goodperson.code.expert.repository;

import java.util.List;

import com.goodperson.code.expert.model.Solution;
import com.goodperson.code.expert.model.SolutionComment;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SolutionCommentRepository extends JpaRepository<SolutionComment, Long> {

    List<SolutionComment> findAllBySolution(Solution solution);

}