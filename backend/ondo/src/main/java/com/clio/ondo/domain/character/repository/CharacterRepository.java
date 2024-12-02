package com.clio.ondo.domain.character.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clio.ondo.domain.character.model.Character;

public interface CharacterRepository extends JpaRepository<Character,Long> {

	Optional<Character> findByMemberId(Long memberId);

}
