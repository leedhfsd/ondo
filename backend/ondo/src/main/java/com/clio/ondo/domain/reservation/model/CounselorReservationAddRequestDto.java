package com.clio.ondo.domain.reservation.model;

import lombok.Data;

@Data
public class CounselorReservationAddRequestDto {
    private String reservationDate;
    private Long counselorId;
}
