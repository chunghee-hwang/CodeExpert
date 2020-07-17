package com.goodperson.code.expert.repository;

import com.goodperson.code.expert.model.Language;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Long> {

}