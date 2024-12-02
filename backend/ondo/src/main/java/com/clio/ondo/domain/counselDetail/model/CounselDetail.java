package com.clio.ondo.domain.counselDetail.model;

import com.clio.ondo.domain.reservation.model.Reservation;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class CounselDetail {

	@Id
	private Long id;
	@OneToOne(fetch = FetchType.LAZY)
	@MapsId
	@JoinColumn(name = "id")  // CounselDetail의 id는 Reservation의 id와 동일
	private Reservation reservation;
	private String content;

	public CounselDetail(Reservation reservation, String content) {
		this.reservation = reservation;
		this.content = content;
	}

	public void updateContent(String content){
		this.content = content;
	}
}
