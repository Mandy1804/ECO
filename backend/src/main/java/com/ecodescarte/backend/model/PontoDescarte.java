package com.ecodescarte.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ponto_descarte")
@Data
public class PontoDescarte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false, length = 255)
    private String endereco;

    @Column(name = "latitude")
    private double latitude;

    @Column(name = "longitude")
    private double longitude;

    @Column(name = "residuos_aceitos", columnDefinition = "TEXT")
    private String residuosAceitos;
}