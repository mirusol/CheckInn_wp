package org.example.security;


import org.example.model.User;
import org.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("======= AUTHENTICATION DEBUG =======");
        System.out.println("Looking for user with username/email: " + username);

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> {
                    System.out.println("User NOT found with email: " + username);
                    return new UsernameNotFoundException("User not found with email: " + username);
                });

        System.out.println("User FOUND: " + user.getEmail());
        System.out.println("Role: " + user.getRole());
        System.out.println("Password (first 10 chars): " + user.getPassword().substring(0, 10) + "...");
        System.out.println("Is account active? " + user.isActive());
        System.out.println("===================================");

        return user;
    }
}