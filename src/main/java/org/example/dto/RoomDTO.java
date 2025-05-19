package org.example.dto;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomDTO {

    private Long id;

    @NotBlank(message = "Room name is required")
    private String name;

    @NotBlank(message = "Room type is required")
    private String type;

    @NotBlank(message = "Room description is required")
    private String description;

    @NotNull(message = "Price per night is required")
    @Min(value = 1, message = "Price must be greater than 0")
    private BigDecimal pricePerNight;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    private boolean available = true;
}