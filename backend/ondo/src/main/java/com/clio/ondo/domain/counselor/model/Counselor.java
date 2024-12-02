package com.clio.ondo.domain.counselor.model;

import java.util.ArrayList;
import java.util.List;

import com.clio.ondo.domain.career.model.Career;
import com.clio.ondo.domain.member.model.Gender;
import com.clio.ondo.domain.member.model.Role;
import com.clio.ondo.domain.reservation.model.Reservation;
import com.clio.ondo.domain.schedule.model.Schedule;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
@ToString
public class Counselor {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "counselor_id", nullable = false)
	private String counselorId;

	@Column(name = "counselor_pw", nullable = false)
	private String password;

	@Column(name = "counselor_name", nullable = false)
	private String name;

	@Enumerated(EnumType.STRING)
	private Gender gender;

	@Column(nullable = false)
	private String field;

	@Column(name = "self_introduction")
	private String selfIntroduction;

	@Column(name = "profile_url")
	private String profileUrl;

	@OneToMany(mappedBy = "counselor")
	private List<Reservation> reservations = new ArrayList<>();

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "schedule_id", nullable = false)
	private Schedule schedule;

	@Enumerated(EnumType.STRING)
	private Role role;

	@OneToMany(mappedBy="counselor")
	private List<Career> career=new ArrayList<>();

	public void updateSelfIntroduction(String selfIntroduction) {
		this.selfIntroduction = selfIntroduction;
	}

	public void updatePassword(String newPassword) {
		this.password = newPassword;
	}

	public void updateProfileUrl(String profileUrl) {
		this.profileUrl = profileUrl;
	}

	public void updateSchedule(Schedule schedule){
		this.schedule=schedule;
	}



	@Builder
	public Counselor(String counselorId, String password, String name, String field, String selfIntroduction, String profileUrl, Gender gender, Role role) {
		this.counselorId = counselorId;
		this.password = password;
		this.name = name;
		this.field = field;
		this.selfIntroduction = selfIntroduction;
		this.profileUrl = profileUrl;
		this.role = role;
		this.gender = gender;
	}
}
