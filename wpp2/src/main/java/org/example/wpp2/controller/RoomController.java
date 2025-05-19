package org.example.controller;

import org.example.dto.RoomDTO;
import org.example.model.Room;
import org.example.model.RoomImage;
import org.example.service.FileStorageService;
import org.example.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Controller
public class RoomController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/rooms")
    public String listRooms(Model model,
                            @RequestParam(required = false) LocalDate checkIn,
                            @RequestParam(required = false) LocalDate checkOut) {
        List<Room> rooms;

        try {
            if (checkIn != null && checkOut != null) {
                rooms = roomService.getAvailableRoomsForDateRange(checkIn, checkOut);
                model.addAttribute("checkIn", checkIn);
                model.addAttribute("checkOut", checkOut);
            } else {
                rooms = roomService.getAvailableRooms();
            }

            model.addAttribute("rooms", rooms != null ? rooms : new ArrayList<>());
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Error loading rooms: " + e.getMessage());
            model.addAttribute("rooms", new ArrayList<>());
        }

        return "rooms/list";
    }

    @GetMapping("/rooms/{id}")
    public String viewRoom(@PathVariable Long id, Model model) {
        try {
            Room room = roomService.getRoomById(id);
            model.addAttribute("room", room);

            List<RoomImage> images = roomService.getRoomImages(id);
            model.addAttribute("images", images != null ? images : new ArrayList<>());
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Error loading room details: " + e.getMessage());
        }

        return "rooms/view";
    }

    @GetMapping("/admin/rooms")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminRooms(Model model) {
        try {
            List<Room> rooms = roomService.getAllRooms();
            model.addAttribute("rooms", rooms != null ? rooms : new ArrayList<>());
            model.addAttribute("roomDTO", new RoomDTO());
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Error loading rooms for admin: " + e.getMessage());
            model.addAttribute("rooms", new ArrayList<>());
        }

        return "admin/rooms";
    }

    @PostMapping("/admin/rooms")
    @PreAuthorize("hasRole('ADMIN')")
    public String createRoom(@Valid @ModelAttribute("roomDTO") RoomDTO roomDTO,
                             BindingResult bindingResult,
                             RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            return "admin/rooms";
        }

        try {
            roomService.createRoom(roomDTO);
            redirectAttributes.addFlashAttribute("successMessage", "Room created successfully");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error creating room: " + e.getMessage());
        }

        return "redirect:/admin/rooms";
    }

    @PostMapping("/admin/rooms/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String updateRoom(@PathVariable Long id,
                             @Valid @ModelAttribute("roomDTO") RoomDTO roomDTO,
                             BindingResult bindingResult,
                             RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            return "admin/rooms";
        }

        try {
            roomService.updateRoom(id, roomDTO);
            redirectAttributes.addFlashAttribute("successMessage", "Room updated successfully");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error updating room: " + e.getMessage());
        }

        return "redirect:/admin/rooms";
    }

    @PostMapping("/admin/rooms/{id}/toggle-availability")
    @PreAuthorize("hasRole('ADMIN')")
    public String toggleRoomAvailability(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            roomService.toggleRoomAvailability(id);
            redirectAttributes.addFlashAttribute("successMessage", "Room availability updated");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error toggling room availability: " + e.getMessage());
        }

        return "redirect:/admin/rooms";
    }

    @PostMapping("/admin/rooms/{id}/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteRoom(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            roomService.deleteRoom(id);
            redirectAttributes.addFlashAttribute("successMessage", "Room deleted successfully");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error deleting room: " + e.getMessage());
        }

        return "redirect:/admin/rooms";
    }

    @GetMapping("/admin/rooms/{id}/images")
    @PreAuthorize("hasRole('ADMIN')")
    public String manageRoomImages(@PathVariable Long id, Model model) {
        try {
            Room room = roomService.getRoomById(id);
            List<RoomImage> images = roomService.getRoomImages(id);

            model.addAttribute("room", room);
            model.addAttribute("images", images != null ? images : new ArrayList<>());
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Error loading room images: " + e.getMessage());
        }

        return "admin/room-images";
    }

    @PostMapping("/admin/rooms/{id}/images")
    @PreAuthorize("hasRole('ADMIN')")
    public String uploadRoomImage(@PathVariable Long id,
                                  @RequestParam("file") MultipartFile file,
                                  @RequestParam(value = "primary", defaultValue = "false") boolean isPrimary,
                                  RedirectAttributes redirectAttributes) {
        try {
            String filename = fileStorageService.store(file);
            String filePath = "/uploads/" + filename;

            roomService.addRoomImage(id, filename, filePath, isPrimary);

            redirectAttributes.addFlashAttribute("successMessage", "Image uploaded successfully");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to upload image: " + e.getMessage());
        }

        return "redirect:/admin/rooms/" + id + "/images";
    }

    @PostMapping("/admin/rooms/images/{imageId}/set-primary")
    @PreAuthorize("hasRole('ADMIN')")
    public String setRoomImageAsPrimary(@PathVariable Long imageId, RedirectAttributes redirectAttributes) {
        try {
            roomService.setRoomImageAsPrimary(imageId);
            redirectAttributes.addFlashAttribute("successMessage", "Primary image updated successfully");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/admin/rooms";
    }

    @PostMapping("/admin/rooms/images/{imageId}/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteRoomImage(@PathVariable Long imageId, RedirectAttributes redirectAttributes) {
        try {
            roomService.deleteRoomImage(imageId);
            redirectAttributes.addFlashAttribute("successMessage", "Image deleted successfully");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/admin/rooms";
    }

    @GetMapping("/uploads/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Resource file = fileStorageService.loadAsResource(filename);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                    .body(file);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // REST API endpoints for room operations

    @GetMapping("/api/rooms")
    @ResponseBody
    public List<Room> getAllRooms(
            @RequestParam(required = false) LocalDate checkIn,
            @RequestParam(required = false) LocalDate checkOut) {
        if (checkIn != null && checkOut != null) {
            return roomService.getAvailableRoomsForDateRange(checkIn, checkOut);
        } else {
            return roomService.getAvailableRooms();
        }
    }

    @GetMapping("/api/rooms/{id}")
    @ResponseBody
    public Room getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id);
    }

    @PostMapping("/api/admin/rooms")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseBody
    public Room createRoomApi(@Valid @RequestBody RoomDTO roomDTO) {
        return roomService.createRoom(roomDTO);
    }

    @PutMapping("/api/admin/rooms/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseBody
    public Room updateRoomApi(@PathVariable Long id, @Valid @RequestBody RoomDTO roomDTO) {
        return roomService.updateRoom(id, roomDTO);
    }

    @PutMapping("/api/admin/rooms/{id}/toggle-availability")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseBody
    public Room toggleRoomAvailabilityApi(@PathVariable Long id) {
        roomService.toggleRoomAvailability(id);
        return roomService.getRoomById(id);
    }

    @DeleteMapping("/api/admin/rooms/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseBody
    public void deleteRoomApi(@PathVariable Long id) {
        roomService.deleteRoom(id);
    }
}