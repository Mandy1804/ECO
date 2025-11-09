package com.ecodescarte.backend.repository;

import com.ecodescarte.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Adiciona a anotação @Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Método para checar se o e-mail já existe (usado no Controller de Cadastro)
    boolean existsByEmail(String email);

    // Método para LOGIN (usado no Controller de Login)
    Usuario findByEmailAndSenha(String email, String senha);
}