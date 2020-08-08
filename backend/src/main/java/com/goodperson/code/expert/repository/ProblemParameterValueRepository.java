package com.goodperson.code.expert.repository;

import java.util.List;

import com.goodperson.code.expert.model.Problem;
import com.goodperson.code.expert.model.ProblemParameterValue;
import com.goodperson.code.expert.model.ProblemTestcase;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemParameterValueRepository extends JpaRepository<ProblemParameterValue, Long> {

    List<ProblemParameterValue> findAllByProblemTestcase(ProblemTestcase problemTestcase);

	List<ProblemParameterValue> findAllByProblemTestcase(Problem problem);

}