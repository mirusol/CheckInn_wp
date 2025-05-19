package org.example.repository;


import org.example.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);

    List<Booking> findByRoomId(Long roomId);

    List<Booking> findByRoomIdAndStatusNot(Long roomId, String status);

    List<Booking> findByCheckInDateBetweenOrCheckOutDateBetween(
            LocalDate startDate1, LocalDate endDate1,
            LocalDate startDate2, LocalDate endDate2);
}