package com.clio.ondo.domain.character.model;

import com.clio.ondo.domain.member.model.Member;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(name = "characters")
public class Character {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "character_id")
	private Long id;

	@OneToOne(mappedBy = "character", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
	private Member member;

	@Column(nullable = false)
	private String name;

	@Column(name = "level", nullable = false)
	private int level;

	@Column(name = "exp", nullable = false)
	private int exp;
	
	public Character() {
		this.name = "다람이";
		this.level = 1;
		this.exp = 0;
	}
	
	public void updateName(String name) {
		this.name = name;
	}

	public void updateLevel(int level) {
		this.level = level;
	}

	public void increaseExp(int additionalExp) {
		int exp = this.exp + additionalExp;
		if(exp >= 100) {
			this.exp = exp - 100;
			this.level = this.level + 1;
		}
		else{
			this.exp = exp;
		}
	}

	public void setMember(Member member) {
		this.member = member;
	}
}
