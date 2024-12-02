package com.clio.ondo.domain.schedule.model;

import com.clio.ondo.domain.counselor.model.Counselor;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Schedule {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String monday;

	@Column(nullable = false)
	private String tuesday;

	@Column(nullable = false)
	private String wednesday;

	@Column(nullable = false)
	private String thursday;

	@Column(nullable = false)
	private String friday;

	@OneToOne(mappedBy = "schedule", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
	private Counselor counselor;

	public Schedule(Counselor counselor) {
		this.monday = "000000000";
		this.tuesday = "000000000";
		this.wednesday = "000000000";
		this.thursday = "000000000";
		this.friday = "000000000";
		this.counselor = counselor;
	}

	public void update(ScheduleDto newSchedule){
		this.monday = newSchedule.getMonday();
		this.tuesday = newSchedule.getTuesday();
		this.wednesday = newSchedule.getWednesday();
		this.thursday = newSchedule.getThursday();
		this.friday = newSchedule.getFriday();
	}
}
