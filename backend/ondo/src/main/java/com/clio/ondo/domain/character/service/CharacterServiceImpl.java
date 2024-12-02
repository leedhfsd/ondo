package com.clio.ondo.domain.character.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clio.ondo.domain.character.model.Character;
import com.clio.ondo.domain.character.repository.CharacterRepository;
import com.clio.ondo.domain.member.model.Member;
import com.clio.ondo.domain.member.repository.MemberRepository;
import com.clio.ondo.global.auth.jwtUtil.JwtTokenProvider;
import com.clio.ondo.global.exception.member.MemberNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class CharacterServiceImpl implements CharacterService {

	private final CharacterRepository characterRepository;
	private final MemberRepository memberRepository;
	private final JwtTokenProvider jwtTokenProvider;

	//캐릭터 가져오기
	@Override
	public Character getCharacters(Long memberId) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new MemberNotFoundException("회원 정보가 없습니다"));
		return member.getCharacter();
	}

	//캐릭터 exp 업데이트
	@Override
	@Transactional
	public void updateExp(Long memberId, int exp) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new MemberNotFoundException("회원 정보가 없습니다"));
		member.getCharacter().increaseExp(exp);
	}

	//현재 exp로 레벨 확인하기
	@Override
	@Transactional
	public void checkLevel(Long memberId, int exp){

		if(exp<100) updateLevel(memberId,1);
		else if(exp<200) updateLevel(memberId,2);
		else if(exp<300) updateLevel(memberId,3);
		else if(exp<400) updateLevel(memberId,4);
		else updateLevel(memberId,5);

	}

	//레벨변경하기
	@Override
	@Transactional
	public void updateLevel(Long memberId, int level) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new MemberNotFoundException("회원 정보가 없습니다"));
		member.getCharacter().updateLevel(level);
	}

	//이름바꾸기
	@Override
	@Transactional
	public void changeName(Long memberId, String newName) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new MemberNotFoundException("회원 정보가 없습니다"));
		member.getCharacter().updateName(newName);
	}
}
