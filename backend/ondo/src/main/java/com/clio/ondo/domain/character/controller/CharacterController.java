package com.clio.ondo.domain.character.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.clio.ondo.domain.character.model.Character;
import com.clio.ondo.domain.character.model.dto.ChangeRequestDto;
import com.clio.ondo.domain.character.model.dto.CharacterResponseDto;
import com.clio.ondo.domain.character.service.CharacterService;
import com.clio.ondo.global.ResponseVO;
import com.clio.ondo.global.auth.jwtUtil.JwtTokenProvider;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/v1/character")
@Slf4j
public class CharacterController {

	private final JwtTokenProvider jwtTokenProvider;
	private final CharacterService characterService;

	//현재 멤버의 캐릭터 가져오기
	@GetMapping("/getCharacter")
	public ResponseEntity<ResponseVO<CharacterResponseDto>> getCharacter(HttpServletRequest request){
		String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
		Long memberId = jwtTokenProvider.getIdFromToken(token);

		Character character = characterService.getCharacters(memberId);
		CharacterResponseDto res = new CharacterResponseDto(character.getName(), character.getLevel(), character.getExp());

		return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("character", res));
	}

	//현재 멤버의 캐릭터 이름 바꾸기
	@PostMapping("/changeName")
	public ResponseEntity<ResponseVO<Void>> changeName(HttpServletRequest request,
		@RequestBody ChangeRequestDto changeName){
		String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
		Long memberId = jwtTokenProvider.getIdFromToken(token);
		String newName=changeName.getName();
		characterService.changeName(memberId,newName);

		return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("이름 업데이트 완료"));
		
	}

}
