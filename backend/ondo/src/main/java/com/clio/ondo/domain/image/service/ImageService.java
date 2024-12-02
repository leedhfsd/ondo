package com.clio.ondo.domain.image.service;

import java.io.File;
import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface ImageService {

	String upload(MultipartFile multipartFile, String dirName) throws IOException;

	//S3에 업로드하고 url 반환
	String uploadAndMember(MultipartFile uploadFile, String dirName, Long memberId) throws IOException;

	//S3에 업로드하고 url 반환
	@Transactional
	String updateAndMember(MultipartFile multipartFile, String dirName, Long memberId) throws IOException;

	//S3에 업로드하고 url 반환
	@Transactional
	String updateAndCounselor(MultipartFile multipartFile, String dirName, Long counselorId) throws IOException;

	void delete(String imageUrl,String dirName);
}
