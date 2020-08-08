package com.goodperson.code.expert.repository;

import java.util.List;

import com.goodperson.code.expert.model.Problem;
import com.goodperson.code.expert.model.ProblemParameter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemParamterRepository extends JpaRepository<ProblemParameter, Long> {

    List<ProblemParameter> findAllByProblemAndTableType(Problem problem, Character tableType);

	List<ProblemParameter> findAllByProblem(Problem problem);
}