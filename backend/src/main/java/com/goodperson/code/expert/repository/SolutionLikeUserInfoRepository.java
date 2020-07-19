package com.goodperson.code.expert.repository;

import java.util.Optional;

import com.goodperson.code.expert.model.Solution;
import com.goodperson.code.expert.model.SolutionLikeUserInfo;
import com.goodperson.code.expert.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SolutionLikeUserInfoRepository extends JpaRepository<SolutionLikeUserInfo, Long> {

    long countByLikeSolution(Solution solution);

    Optional<SolutionLikeUserInfo> findByLikeSolutionAndLikeUser(Solution likeSolution, User likeUser);

}