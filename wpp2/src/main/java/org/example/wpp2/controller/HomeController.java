package org.example.controller;

import org.example.model.Room;
import org.example.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class HomeController {

    @Autowired
    private RoomService roomService;

    @GetMapping("/")
    public String home(Model model) {
        List<Room> featuredRooms = roomService.getAvailableRooms();
        model.addAttribute("featuredRooms", featuredRooms);
        return "home";
    }

}