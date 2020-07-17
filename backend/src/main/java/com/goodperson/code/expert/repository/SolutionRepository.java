package com.goodperson.code.expert.repository;

import java.util.Optional;

import com.goodperson.code.expert.model.Code;
import com.goodperson.code.expert.model.Problem;
import com.goodperson.code.expert.model.Solution;
import com.goodperson.code.expert.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolutionRepository extends JpaRepository<Solution, Long> {

    Optional<Solution> findByCode(Code code);

    // 문제를 해결했는지 여부 구하기
    boolean existsByProblemAndCreator(Problem problem, User authenticatedUser);

    // 모든 유저 통틀어 문제 푼 사람 수 구하기(같은 사람이 다른 언어로 풀어도 개수 증가함)
    long countIdByProblem(Problem problem);

    // 내가 푼 문제 수 구하기(다른 언어로 풀어도 개수 증가함)
    long countIdByCreator(User authenticatedUser);

}