package com.ecodescarte.backend.repository;

import com.ecodescarte.backend.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    // O Spring Data JPA fornece automaticamente os métodos save(), findAll(), etc.
}