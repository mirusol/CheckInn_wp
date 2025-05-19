package org.example.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.example.dto.LoginRequest;
import org.example.dto.RegistrationRequest;
import org.example.model.User;
import org.example.repository.UserRepository;
import org.example.security.JwtProvider;
import org.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Controller
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/login")
    public String showLoginPage() {
        return "login";
    }

    @GetMapping("/register")
    public String showRegisterPage(Model model) {
        model.addAttribute("registrationRequest", new RegistrationRequest());
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(@Valid @ModelAttribute("registrationRequest") RegistrationRequest registrationRequest,
                               BindingResult bindingResult,
                               Model model,
                               RedirectAttributes redirectAttributes) {
        // Check for validation errors
        if (bindingResult.hasErrors()) {
            return "register"; // Return to form with error messages
        }

        try {
            User user = userService.registerUser(registrationRequest);
            redirectAttributes.addFlashAttribute("successMessage", "Registration successful! Please login.");
            return "redirect:/login";
        } catch (Exception e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "register";
        }
    }

    // Debug endpoints for troubleshooting

    @GetMapping("/test-users")
    @ResponseBody
    public String testUsers() {
        try {
            return userRepository.findAll().toString();
        } catch (Exception e) {
            return "Error retrieving users: " + e.getMessage();
        }
    }

    @GetMapping("/test-user")
    @ResponseBody
    public String testUser(@RequestParam String email) {
        try {
            Optional<User> user = userRepository.findByEmail(email);
            return user.isPresent() ?
                    "User found: " + user.get().toString() :
                    "User not found with email: " + email;
        } catch (Exception e) {
            return "Error retrieving user: " + e.getMessage();
        }
    }

    @GetMapping("/test-password")
    @ResponseBody
    public String testPassword(@RequestParam String raw, @RequestParam String encoded) {
        try {
            boolean matches = passwordEncoder.matches(raw, encoded);
            return "Password match result: " + matches;
        } catch (Exception e) {
            return "Error checking password: " + e.getMessage();
        }
    }

    @GetMapping("/create-admin")
    @ResponseBody
    public String createAdmin(@RequestParam String name,
                              @RequestParam String email,
                              @RequestParam String password) {
        try {
            if (userRepository.existsByEmail(email)) {
                return "User with this email already exists";
            }

            User admin = new User();
            admin.setName(name);
            admin.setEmail(email);
            admin.setPassword(passwordEncoder.encode(password));
            admin.setRole("ROLE_ADMIN");
            admin.setActive(true);

            userRepository.save(admin);

            return "Admin created successfully: " + email + " with password: " + password;
        } catch (Exception e) {
            return "Error creating admin: " + e.getMessage();
        }
    }
}