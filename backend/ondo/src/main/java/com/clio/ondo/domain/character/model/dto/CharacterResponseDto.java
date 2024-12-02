package com.clio.ondo.domain.character.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CharacterResponseDto {
	private String name;
	private int level;
	private int exp;
}
