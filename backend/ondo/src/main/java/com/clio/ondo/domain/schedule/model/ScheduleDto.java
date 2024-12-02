package com.clio.ondo.domain.schedule.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ScheduleDto {
	private String monday;
	private String tuesday;
	private String wednesday;
	private String thursday;
	private String friday;

	public ScheduleDto(Schedule schedule) {
		this.monday = schedule.getMonday();
		this.tuesday = schedule.getTuesday();
		this.wednesday = schedule.getWednesday();
		this.thursday = schedule.getThursday();
		this.friday = schedule.getFriday();
	}
}
