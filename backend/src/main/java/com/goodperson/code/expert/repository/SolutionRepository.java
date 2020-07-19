package com.goodperson.code.expert.repository;

import java.util.Optional;

import com.goodperson.code.expert.model.Code;
import com.goodperson.code.expert.model.Language;
import com.goodperson.code.expert.model.Problem;
import com.goodperson.code.expert.model.Solution;
import com.goodperson.code.expert.model.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolutionRepository extends PagingAndSortingRepository<Solution, Long> {

    Optional<Solution> findByCode(Code code);

    // 문제를 해결했는지 여부 구하기
    boolean existsByProblemAndCreator(Problem problem, User creator);

    // 한 유저가 푼 모든 문제 개수 구하기(언어가 달라도 누적 없음)
    @Query("select count(distinct s.problem) from Solution s where s.creator = ?1")
    long countProblemResolvedByCreator(User creator);

    // 한 문제를 푼 모든 유저 개수 구하기 (언어가 달라도 누적 없음)
    @Query("select count(distinct s.creator) from Solution s where s.problem = ?1")
    long countUserByResolvedProblem(Problem problem);

    /**
     * Raw query: select s.*, count(l.id) from solution s left join
     * solution_like_user_info l on s.id = l.like_solution_id where s.code_id in
     * (select id from code where language_id=1 and problem_id=1) group by s.id;
     * 
     * 솔루션과 좋아요를 좋아요 개수 순으로 정렬하여 가져오는 쿼리
     */
    @Query("select s, count(l.id) as likeCount from Solution s left join SolutionLikeUserInfo l on s = l.likeSolution "
            + "where s.code in (select c from Code c where c.language = ?1 and c.problem=?2) " + "group by s.id")
    Page<Object[]> findAllSolutionAndLikeCountByProblemAndLanguage(Language language, Problem problem,
            PageRequest pageRequest, Sort sort);
}