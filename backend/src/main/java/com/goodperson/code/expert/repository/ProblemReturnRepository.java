package com.goodperson.code.expert.repository;

import java.util.List;

import com.goodperson.code.expert.model.Problem;
import com.goodperson.code.expert.model.ProblemReturn;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemReturnRepository extends JpaRepository<ProblemReturn, Long> {

    ProblemReturn findByProblemAndTableType(Problem problem, Character tableType);

	List<ProblemReturn> findAllByProblem(Problem problem);

}