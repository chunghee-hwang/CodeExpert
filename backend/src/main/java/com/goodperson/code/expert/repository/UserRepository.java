package com.goodperson.code.expert.repository;

import java.util.Optional;

import com.goodperson.code.expert.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email); // 이메일 중복 검사

    boolean existsByNickname(String nickname); // 닉네임 중복 검사

    Optional<User> findByEmailAndPassword(String email, String password); // 로그인

    Optional<User> findById(Long id);
}