package com.clio.ondo.domain.image.controller;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.clio.ondo.domain.image.service.ImageService;
import com.clio.ondo.global.ResponseVO;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/api/v1/image")
@RestController
@RequiredArgsConstructor
public class ImageController {

	private final ImageService imageService;

	@PostMapping("/upload/{type}")
	public String upload(@PathVariable String type, @RequestParam("data") MultipartFile file) throws IOException{
		return imageService.upload(file,type);
	}

	@PostMapping("/upload/{type}/{memberId}")
	public ResponseEntity<?> uploadMember(@PathVariable String type, @PathVariable Long memberId, @RequestParam("data") MultipartFile file) throws IOException{
		try{
			imageService.uploadAndMember(file,type,memberId);
			return ResponseEntity.status(HttpStatus.CREATED).body(ResponseVO.success("Success"));
		}catch(Exception e){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseVO.failure("이미지 등록 실패"));
		}
	}

	@PostMapping("/update/{type}/{memberId}")
	public ResponseEntity<?> updateMember(@PathVariable String type, @PathVariable Long memberId, @RequestParam("data") MultipartFile file) throws IOException{
		try{
			imageService.updateAndMember(file,type,memberId);
			return ResponseEntity.status(HttpStatus.CREATED).body(ResponseVO.success("Success"));
		}catch(Exception e){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseVO.failure("이미지 수정 실패"));
		}
	}


}
