package com.ecodescarte.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "usuario")
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 100)
    private String email;


    @Column(nullable = false)
    private String senha;

    private LocalDate dataCadastro;


    @Column(length = 20)
    private String telefone;

    @Column(nullable = false, length = 255)
    private String endereco; // Endereço de Coleta/Principal

    private String tipoMaterialInteresse;
}