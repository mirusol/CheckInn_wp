package org.example.controller;


import org.example.model.User;
import org.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public String showUsers(Model model) {
        List<User> users = userService.getAllUsers();
        model.addAttribute("users", users);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userService.getUserByEmail(auth.getName());
        model.addAttribute("currentUser", currentUser);

        return "admin/users";
    }

    @PostMapping("/users/{id}/toggle-active")
    public String toggleUserActive(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userService.getUserByEmail(auth.getName());

        // Prevent admin from deactivating themselves
        if (currentUser.getId().equals(id)) {
            redirectAttributes.addFlashAttribute("errorMessage", "You cannot deactivate your own account.");
            return "redirect:/admin/users";
        }

        userService.toggleUserActive(id);
        return "redirect:/admin/users";
    }

    @PostMapping("/users/{id}/promote")
    public String promoteToAdmin(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        userService.promoteToAdmin(id);
        redirectAttributes.addFlashAttribute("successMessage", "User promoted to Admin successfully.");
        return "redirect:/admin/users";
    }

    @PostMapping("/users/{id}/demote")
    public String demoteToUser(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userService.getUserByEmail(auth.getName());

        // Prevent admin from demoting themselves
        if (currentUser.getId().equals(id)) {
            redirectAttributes.addFlashAttribute("errorMessage", "You cannot demote your own account.");
            return "redirect:/admin/users";
        }

        userService.demoteToUser(id);
        redirectAttributes.addFlashAttribute("successMessage", "User demoted to regular User successfully.");
        return "redirect:/admin/users";
    }

    @PostMapping("/users/{id}/delete")
    public String deleteUser(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userService.getUserByEmail(auth.getName());

        // Prevent admin from deleting themselves
        if (currentUser.getId().equals(id)) {
            redirectAttributes.addFlashAttribute("errorMessage", "You cannot delete your own account.");
            return "redirect:/admin/users";
        }

        userService.deleteUser(id);
        redirectAttributes.addFlashAttribute("successMessage", "User deleted successfully.");
        return "redirect:/admin/users";
    }

    // REST API endpoints for admin operations

    @GetMapping("/api/admin/users")
    @ResponseBody
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/api/admin/users/{id}/toggle-active")
    @ResponseBody
    public User toggleUserActiveApi(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userService.getUserByEmail(auth.getName());

        // Prevent admin from deactivating themselves
        if (currentUser.getId().equals(id)) {
            throw new RuntimeException("You cannot deactivate your own account.");
        }

        userService.toggleUserActive(id);
        return userService.getUserById(id);
    }

    @PostMapping("/api/admin/users/{id}/promote")
    @ResponseBody
    public User promoteToAdminApi(@PathVariable Long id) {
        return userService.promoteToAdmin(id);
    }

    @PostMapping("/api/admin/users/{id}/demote")
    @ResponseBody
    public User demoteToUserApi(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userService.getUserByEmail(auth.getName());

        // Prevent admin from demoting themselves
        if (currentUser.getId().equals(id)) {
            throw new RuntimeException("You cannot demote your own account.");
        }

        return userService.demoteToUser(id);
    }

    @DeleteMapping("/api/admin/users/{id}")
    @ResponseBody
    public void deleteUserApi(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userService.getUserByEmail(auth.getName());

        // Prevent admin from deleting themselves
        if (currentUser.getId().equals(id)) {
            throw new RuntimeException("You cannot delete your own account.");
        }

        userService.deleteUser(id);
    }
}
