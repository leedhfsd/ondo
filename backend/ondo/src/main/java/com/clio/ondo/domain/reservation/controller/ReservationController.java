package com.clio.ondo.domain.reservation.controller;

import org.springframework.web.bind.annotation.RestController;

import com.clio.ondo.domain.reservation.service.ReservationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ReservationController {
	private final ReservationService reservationService;
}
