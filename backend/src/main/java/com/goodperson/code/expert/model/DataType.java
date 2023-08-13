package com.goodperson.code.expert.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class DataType {

    @Id
    private Long id;

    @NonNull
    @Column(nullable = false, length = 30, unique = true)
    private String name;
}