package com.ecodescarte.backend.controller;

import com.ecodescarte.backend.model.Usuario;
import com.ecodescarte.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*", methods = {RequestMethod.POST, RequestMethod.GET})
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    public ResponseEntity<?> cadastrarUsuario(@RequestBody Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            return new ResponseEntity<>("Erro: Este e-mail já está cadastrado.", HttpStatus.BAD_REQUEST);
        }

        Usuario novoUsuario = usuarioRepository.save(usuario);
        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
    }

    // Endpoint para Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario credenciais) {
        Usuario usuario = usuarioRepository.findByEmailAndSenha(credenciais.getEmail(), credenciais.getSenha());

        if (usuario != null) {
            return new ResponseEntity<>("Login bem-sucedido!", HttpStatus.OK);
        } else {
            // 401 Unauthorized (Acesso Negado)
            return new ResponseEntity<>("Credenciais inválidas.", HttpStatus.UNAUTHORIZED);
        }
    }
}