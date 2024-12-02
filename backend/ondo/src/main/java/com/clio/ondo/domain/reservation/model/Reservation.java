package com.clio.ondo.domain.reservation.model;

import java.time.LocalDateTime;
import java.util.Date;

import com.clio.ondo.domain.counselDetail.model.CounselDetail;
import com.clio.ondo.domain.counselor.model.Counselor;
import com.clio.ondo.domain.member.model.Member;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Reservation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private LocalDateTime reservationDate;

	@Column(name = "counseling_reservation_detail")
	private String detail;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id", nullable = true)
	private Member member;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "counselor_id", nullable = false)
	private Counselor counselor;

	@Column(name = "counseling_url")
	private	String counselingUrl;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "counsel_detail_id")
	private CounselDetail counselDetail;

}
