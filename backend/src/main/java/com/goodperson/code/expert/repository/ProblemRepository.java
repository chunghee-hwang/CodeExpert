package com.goodperson.code.expert.repository;

import java.util.List;

import com.goodperson.code.expert.model.Problem;
import com.goodperson.code.expert.model.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemRepository extends PagingAndSortingRepository<Problem, Long> {
    public Problem findFirstByOrderByIdDesc(); // 마지막으로 삽입된 problem 가져오기

    public boolean existsByIdAndCreator(Long id, User creator); // 문제 작성자가 아닌 사람이 문제를 수정할 경우를 체크할 때 사용

    // 문제 유형, 난이도, 페이지를 가지고 문제 목록을 가져오는 메소드
    public Page<Problem> findAllByProblemTypeIdInAndProblemLevelIdIn(List<Long> typeIds, List<Long> levelIds,
            Pageable pageable);

    // 문제 유형, 페이지를 가지고 문제 목록을 가져오는 메소드
    public Page<Problem> findAllByProblemTypeIdIn(List<Long> typeIds, Pageable pageable);

    // 난이도, 페이지를 가지고 문제 목록을 가져오는 메소드
    public Page<Problem> findAllByProblemLevelIdIn(List<Long> levelIds, Pageable pageable);

}