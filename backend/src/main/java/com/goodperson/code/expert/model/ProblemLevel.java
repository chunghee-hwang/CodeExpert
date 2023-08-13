package com.goodperson.code.expert.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ProblemLevel {
    @Id
    private Long id;

    @NonNull
    @Column(nullable = false, columnDefinition = "TINYINT", length = 1, unique = true)
    private Integer name;

}