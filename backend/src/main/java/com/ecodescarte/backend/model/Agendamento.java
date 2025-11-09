package com.ecodescarte.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "agendamento")
@Data
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(length = 20)
    private String telefone;

    @Column(nullable = false, length = 255)
    private String endereco;

    // Dados do Agendamento
    @Column(nullable = false, length = 100)
    private String tipoResiduo;

    @Column(nullable = false)
    private LocalDate dataColeta;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    // Campo para gestão interna
    private String status;
}