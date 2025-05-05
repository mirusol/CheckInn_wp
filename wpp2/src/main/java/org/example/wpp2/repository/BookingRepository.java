package org.example.wpp2.repository;

import org.example.wpp2.model.Booking;
import org.example.wpp2.model.Room;
import org.example.wpp2.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByRoom(Room room);
    List<Booking> findByStatus(String status);
}