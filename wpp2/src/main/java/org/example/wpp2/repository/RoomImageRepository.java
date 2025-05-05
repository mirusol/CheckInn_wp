package org.example.wpp2.repository;

import org.example.wpp2.model.Room;
import org.example.wpp2.model.RoomImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoomImageRepository extends JpaRepository<RoomImage, Long> {
    List<RoomImage> findByRoom(Room room);
}