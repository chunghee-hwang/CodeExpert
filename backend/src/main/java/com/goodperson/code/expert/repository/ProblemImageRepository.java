package com.goodperson.code.expert.repository;

import java.util.List;
import java.util.Optional;

import com.goodperson.code.expert.model.Problem;
import com.goodperson.code.expert.model.ProblemImage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemImageRepository extends JpaRepository<ProblemImage, Long> {

    Optional<ProblemImage> findByFileName(String fileName);

    List<ProblemImage> findAllByProblem(Problem problem);

}