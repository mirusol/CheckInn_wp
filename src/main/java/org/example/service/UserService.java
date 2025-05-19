package org.example.service;


import org.example.dto.RegistrationRequest;
import org.example.exception.ResourceNotFoundException;
import org.example.model.User;
import org.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @Transactional
    public User registerUser(RegistrationRequest registrationRequest) {
        // Check if user already exists
        if (userRepository.existsByEmail(registrationRequest.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        // Create new user
        User user = new User();
        user.setName(registrationRequest.getName());
        user.setEmail(registrationRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        user.setRole("ROLE_USER");
        user.setActive(true);

        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);

        user.setName(userDetails.getName());
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        return userRepository.save(user);
    }

    @Transactional
    public void toggleUserActive(Long id) {
        User user = getUserById(id);
        user.setActive(!user.isActive());
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    @Transactional
    public User promoteToAdmin(Long id) {
        User user = getUserById(id);
        user.setRole("ROLE_ADMIN");
        return userRepository.save(user);
    }

    @Transactional
    public User demoteToUser(Long id) {
        User user = getUserById(id);
        user.setRole("ROLE_USER");
        return userRepository.save(user);
    }
}