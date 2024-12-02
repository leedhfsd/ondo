package com.clio.ondo.domain.reservation.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.clio.ondo.domain.reservation.model.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
	List<Reservation> findByMemberId(Long memberId);
	List<Reservation> findByCounselorId(Long counselorId);

	Page<Reservation> findByMemberIdAndCounselorIdOrderByReservationDateDesc(Long memberId, Long counselorId, Pageable pageable);

	Optional<Reservation> findById(Long id);
	Optional<Reservation> findByCounselingUrl(String counselingUrl);
}
