package com.ecodescarte.backend.repository;

import com.ecodescarte.backend.model.PontoDescarte;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PontoDescarteRepository extends JpaRepository<PontoDescarte, Long> {
}