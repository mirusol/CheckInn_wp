package org.example.service;


import org.example.dto.RoomDTO;
import org.example.exception.ResourceNotFoundException;
import org.example.model.Room;
import org.example.model.RoomImage;
import org.example.repository.RoomImageRepository;
import org.example.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomImageRepository roomImageRepository;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public List<Room> getAvailableRooms() {
        return roomRepository.findByAvailableTrue();
    }

    public List<Room> getAvailableRoomsForDateRange(LocalDate checkInDate, LocalDate checkOutDate) {
        return roomRepository.findAvailableRoomsForDateRange(checkInDate, checkOutDate);
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", id));
    }

    @Transactional
    public Room createRoom(RoomDTO roomDTO) {
        Room room = new Room();
        room.setName(roomDTO.getName());
        room.setType(roomDTO.getType());
        room.setDescription(roomDTO.getDescription());
        room.setPricePerNight(roomDTO.getPricePerNight());
        room.setCapacity(roomDTO.getCapacity());
        room.setAvailable(roomDTO.isAvailable());

        return roomRepository.save(room);
    }

    @Transactional
    public Room updateRoom(Long id, RoomDTO roomDTO) {
        Room room = getRoomById(id);

        room.setName(roomDTO.getName());
        room.setType(roomDTO.getType());
        room.setDescription(roomDTO.getDescription());
        room.setPricePerNight(roomDTO.getPricePerNight());
        room.setCapacity(roomDTO.getCapacity());
        room.setAvailable(roomDTO.isAvailable());

        return roomRepository.save(room);
    }

    @Transactional
    public void deleteRoom(Long id) {
        Room room = getRoomById(id);
        roomRepository.delete(room);
    }

    @Transactional
    public void toggleRoomAvailability(Long id) {
        Room room = getRoomById(id);
        room.setAvailable(!room.isAvailable());
        roomRepository.save(room);
    }

    @Transactional
    public RoomImage addRoomImage(Long roomId, String filename, String filePath, boolean isPrimary) {
        Room room = getRoomById(roomId);

        if (isPrimary) {
            // If this is a primary image, reset any existing primary image
            RoomImage existingPrimary = roomImageRepository.findByRoomIdAndIsPrimaryTrue(roomId);
            if (existingPrimary != null) {
                existingPrimary.setPrimary(false);
                roomImageRepository.save(existingPrimary);
            }
        }

        RoomImage roomImage = new RoomImage();
        roomImage.setRoom(room);
        roomImage.setFilename(filename);
        roomImage.setFilePath(filePath);
        roomImage.setPrimary(isPrimary);

        return roomImageRepository.save(roomImage);
    }

    public List<RoomImage> getRoomImages(Long roomId) {
        getRoomById(roomId); // Verify room exists
        return roomImageRepository.findByRoomId(roomId);
    }

    @Transactional
    public void deleteRoomImage(Long imageId) {
        RoomImage image = roomImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("RoomImage", "id", imageId));
        roomImageRepository.delete(image);
    }

    @Transactional
    public void setRoomImageAsPrimary(Long imageId) {
        RoomImage image = roomImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("RoomImage", "id", imageId));

        // Reset any existing primary image
        RoomImage existingPrimary = roomImageRepository.findByRoomIdAndIsPrimaryTrue(image.getRoom().getId());
        if (existingPrimary != null) {
            existingPrimary.setPrimary(false);
            roomImageRepository.save(existingPrimary);
        }

        image.setPrimary(true);
        roomImageRepository.save(image);
    }
}
