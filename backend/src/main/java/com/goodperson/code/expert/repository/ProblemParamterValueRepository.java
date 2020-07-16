package com.goodperson.code.expert.repository;

import com.goodperson.code.expert.model.ProblemParameter;
import com.goodperson.code.expert.model.ProblemParameterValue;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemParamterValueRepository extends JpaRepository<ProblemParameterValue, Long>
{
    
}