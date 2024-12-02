package com.clio.ondo.domain.member.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.clio.ondo.domain.character.model.Character;
import com.clio.ondo.domain.reservation.model.Reservation;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@ToString
@NoArgsConstructor
public class Member {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "member_id", nullable = false)
	private Long id;

	@Column(name = "member_pw", nullable = false)
	private String password;

	@Column(nullable = false)
	private String email;

	@Column(name = "member_name", nullable = false)
	private String name;

	@Column(name = "nick_name", nullable = false)
	private String nickname;

	@Temporal(TemporalType.DATE)
	@Column(name = "join_date", nullable = false)
	private Date joinDate;

	@Enumerated(EnumType.STRING)
	@Column(name = "role", nullable = false)
	private Role role;

	@Column(name = "profile_url")
	private String profileUrl;

	@Enumerated(EnumType.STRING)
	private Gender gender;

	@Column(name = "birth_date")
	private LocalDate birthDate;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "character_id", nullable = false)
	private Character character;

	@OneToMany(mappedBy = "member")
	private List<Reservation> reservations = new ArrayList<>();

	public void updateNickName(String newNickname) {
		this.nickname = newNickname;
	}

	public void updateProfileUrl(String newProfileUrl) {
		this.profileUrl = newProfileUrl;
	}

	public void updatePassword(String newPassword) {
		this.password = newPassword;
	}

	@Builder
	public Member(String email, String password, String name, String nickname, Role role, LocalDate birthDate,
		Gender gender, String profileUrl) {
		this.email = email;
		this.password = password;
		this.name = name;
		this.nickname = nickname;
		this.joinDate = new Date();
		this.role = role;
		this.birthDate = birthDate;
		this.gender = gender;
		this.profileUrl = profileUrl;
		if (character != null) {
			character.setMember(this);
		} else {
			this.character = new Character();
			this.character.setMember(this);
		}
	}

	public void setDefaultPasswordIfNotSet() {
		if (this.password == null) {
			this.password = generateRandomPassword();
		}
	}

	private String generateRandomPassword() {
		return UUID.randomUUID().toString();
	}
}