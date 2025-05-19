package org.example.repository;

import org.example.model.RoomImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomImageRepository extends JpaRepository<RoomImage, Long> {
    List<RoomImage> findByRoomId(Long roomId);
    RoomImage findByRoomIdAndIsPrimaryTrue(Long roomId);
    void deleteByRoomId(Long roomId);
}