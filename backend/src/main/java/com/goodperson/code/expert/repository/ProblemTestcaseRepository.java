package com.goodperson.code.expert.repository;

import java.util.List;

import com.goodperson.code.expert.model.Problem;
import com.goodperson.code.expert.model.ProblemTestcase;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemTestcaseRepository extends JpaRepository<ProblemTestcase, Long> {

    List<ProblemTestcase> findAllByProblemAndTableType(Problem problem, Character tableType);

	List<ProblemTestcase> findAllByProblem(Problem problem);
}