package com.clio.ondo.domain.reservation.model;

import java.time.LocalDateTime;

import com.clio.ondo.domain.counselDetail.model.CounselDetail;
import com.clio.ondo.domain.counselor.model.Counselor;
import com.clio.ondo.domain.member.model.Member;

import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CounselorReservationAddDto {
	private LocalDateTime reservationDate;
	private Long counselorId;
}
