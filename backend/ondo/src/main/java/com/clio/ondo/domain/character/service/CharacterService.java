package com.clio.ondo.domain.character.service;

import com.clio.ondo.domain.character.model.Character;

public interface CharacterService {

	 Character getCharacters(Long memberId);
	 void updateExp(Long memberId, int exp);
	 void changeName(Long memberId,String newName);
	 void updateLevel(Long memberId, int level);
	 void checkLevel(Long memberId, int exp);
}
