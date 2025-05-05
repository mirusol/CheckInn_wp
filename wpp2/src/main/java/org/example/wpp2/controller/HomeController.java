package org.example.wpp2.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        // Redirect to admin dashboard
        return "redirect:/html/admin/dashboard.html";
    }

    @GetMapping("/admin")
    public String admin() {
        // Redirect to admin dashboard
        return "redirect:/html/admin/dashboard.html";
    }

    // Handle error page - redirect to admin dashboard
    @GetMapping("/error")
    public String handleError() {
        return "redirect:/html/admin/dashboard.html";
    }
}