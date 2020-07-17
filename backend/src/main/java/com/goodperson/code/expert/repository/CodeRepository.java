package com.goodperson.code.expert.repository;

import java.util.Optional;

import com.goodperson.code.expert.model.Code;
import com.goodperson.code.expert.model.Language;
import com.goodperson.code.expert.model.Problem;
import com.goodperson.code.expert.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CodeRepository extends JpaRepository<Code, Long> {

    Optional<Code> findByProblemAndLanguageAndCreator(Problem problem, Language language, User creator);

}