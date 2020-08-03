package com.goodperson.code.expert;

import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.goodperson.code.expert.model.DataType;
import com.goodperson.code.expert.model.Language;
import com.goodperson.code.expert.model.ProblemLevel;
import com.goodperson.code.expert.model.ProblemType;
import com.goodperson.code.expert.repository.DataTypeRepository;
import com.goodperson.code.expert.repository.LanguageRepository;
import com.goodperson.code.expert.repository.ProblemLevelRepository;
import com.goodperson.code.expert.repository.ProblemTypeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements ApplicationRunner {
        @Autowired
        private DataTypeRepository dataTypeRepository;
        @Autowired
        private LanguageRepository languageRepository;

        @Autowired
        private ProblemLevelRepository problemLevelRepository;

        @Autowired
        private ProblemTypeRepository problemTypeRepository;

        @Override
        public void run(ApplicationArguments args) throws Exception {
                initProblemTypeAndLevelAndDataTypeAndLanguage();
        }

        private void initProblemTypeAndLevelAndDataTypeAndLanguage() {
                final ProblemLevel[] problemLevels = new ProblemLevel[] { new ProblemLevel(1L, 1),
                                new ProblemLevel(2L, 2), new ProblemLevel(3L, 3), new ProblemLevel(4L, 4) };
                final ProblemType[] problemTypes = new ProblemType[] {
                                new ProblemType(1L, "동적 계획법(Dynamic Programming)"), new ProblemType(2L, "해시"),
                                new ProblemType(3L, "정렬"), new ProblemType(4L, "완전 탐색"), new ProblemType(5L, "탐욕법"),
                                new ProblemType(6L, "힙(Heap)"), new ProblemType(7L, "스택/큐"),
                                new ProblemType(8L, "깊이/너비 우선탐색(DFS/BFS)"), new ProblemType(9L, "이분 탐색"),
                                new ProblemType(10L, "그래프"), new ProblemType(11L, "기타") };

                final DataType[] dataTypes = new DataType[] { new DataType(1L, "integer"),
                                new DataType(2L, "integer_array"), new DataType(3L, "long"),
                                new DataType(4L, "long_array"), new DataType(5L, "double"),
                                new DataType(6L, "double_array"), new DataType(7L, "boolean"),
                                new DataType(8L, "boolean_array"), new DataType(9L, "string"),
                                new DataType(10L, "string_array") };

                final Language[] languages = new Language[] { new Language(1L, "cpp"), new Language(2L, "python3"),
                                new Language(3L, "java") };

                problemLevelRepository.saveAll(Stream.of(problemLevels).collect(Collectors.toList()));
                problemTypeRepository.saveAll(Stream.of(problemTypes).collect(Collectors.toList()));
                dataTypeRepository.saveAll(Stream.of(dataTypes).collect(Collectors.toList()));
                languageRepository.saveAll(Stream.of(languages).collect(Collectors.toList()));
        }

}