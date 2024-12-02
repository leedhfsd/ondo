package com.clio.ondo.domain.image.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.clio.ondo.domain.counselor.model.Counselor;
import com.clio.ondo.domain.counselor.repository.CounselorRepository;
import com.clio.ondo.domain.member.model.Member;
import com.clio.ondo.domain.member.repository.MemberRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
@PropertySource("classpath:s3.properties")
public class ImageServiceImpl implements ImageService {
	@Value("${profile.url}")
	String defaultProfileUrl; //기본 프로필 이미지
	
	private final AmazonS3 amazonS3;
	private final MemberRepository memberRepository;
	private final CounselorRepository counselorRepository;

	@Value("${cloud.aws.s3.bucket}")
	private String bucket;

	@Override
	//MultipartFile 받아서 File로 변환 후 S3에 업로드
	public String upload(MultipartFile multipartFile, String dirName) throws IOException {
		File uploadFile = convert(multipartFile)
			.orElseThrow(() -> new IllegalArgumentException("file 변환 오류"));
		return uploadUrl(uploadFile, dirName);
	}

	//S3에 업로드하고 url 반환
	private String uploadUrl(File uploadFile, String dirName){
		String fileName=dirName+"/"+uploadFile.getName();
		String uploadImageUrl=putS3(uploadFile,fileName);
		
		//여기서 key 뽑아내고 cloudFront domain 넣기
		int startIndex = uploadImageUrl.indexOf(dirName+"/");
		String path = uploadImageUrl.substring(startIndex);
		String UploadImageUrl="https://d1kbrt3q8264bl.cloudfront.net/"+path;
		
		removeNewFile(uploadFile);
		return UploadImageUrl;
	}

	//멤버 회원가입
	@Override
	@Transactional
	public String uploadAndMember(MultipartFile multipartFile, String dirName, Long memberId) throws IOException{
		System.out.println(multipartFile);

		if(multipartFile.isEmpty()){
			return "";
		}

		File uploadFile = convert(multipartFile)
			.orElseThrow(() -> new IllegalArgumentException("file 변환 오류"));
		String url = uploadUrl(uploadFile, dirName);
		Optional<Member> member = memberRepository.findById(memberId);
		if(member.isPresent()){
			member.get().updateProfileUrl(url);
		}
		return url;
	}

	//멤버 수정
	@Override
	@Transactional
	public String updateAndMember(MultipartFile multipartFile, String dirName, Long memberId) throws IOException{
		Optional<Member> memberOptional = memberRepository.findById(memberId);
		Member member = memberOptional.get();
		String profileUrl = member.getProfileUrl();

		//무조건 update 되어야함.
		if(!Objects.equals(profileUrl, defaultProfileUrl)){ //기본 이미지가 아니라면
			delete(profileUrl,"MemberProfile"); //원래 profileImage 삭제
		}

		if(!multipartFile.isEmpty()){
			profileUrl= upload(multipartFile,"MemberProfile");
		}else{
			String fileName = multipartFile.getOriginalFilename();
			if ("default.jpg".equals(fileName)) {
				profileUrl = defaultProfileUrl;
			} else if ("empty.jpg".equals(fileName)) {
				profileUrl = member.getProfileUrl();
			}
		}

		member.updateProfileUrl(profileUrl);
		return null;
	}

	//S3에 업로드하고 url 반환
	@Override
	@Transactional
	public String updateAndCounselor(MultipartFile multipartFile, String dirName, Long counselorId) throws IOException{
		Optional<Counselor> counselorOptional = counselorRepository.findById(counselorId);
		Counselor counselor = counselorOptional.get();
		String profileUrl = counselor.getProfileUrl();

		//무조건 update 되어야함.
		if(!Objects.equals(profileUrl, defaultProfileUrl)){ //기본 이미지가 아니라면
			delete(profileUrl,"CounselorProfile"); //원래 profileImage 삭제
		}

		if(!multipartFile.isEmpty()){
			profileUrl= upload(multipartFile,"CounselorProfile");
		}else{
			String fileName = multipartFile.getOriginalFilename();
			if ("default.jpg".equals(fileName)) {
				profileUrl = defaultProfileUrl;
			} else if ("empty.jpg".equals(fileName)) {
				profileUrl = counselor.getProfileUrl();
			}
		}

		counselor.updateProfileUrl(profileUrl);
		return null;
	}

	//로컬 서버에서 임시 파일 삭제
	private void removeNewFile(File uploadFile){
		if(uploadFile.delete()){
			log.debug("서버 파일 삭제");
		}else{
			log.debug("서버 파일 삭제 실패");
		}
	}

	//파일 S3에 업로드하고 URL 반환
	private String putS3(File uploadFile, String fileName){
		amazonS3.putObject(new PutObjectRequest(bucket,fileName,uploadFile)
			.withCannedAcl(CannedAccessControlList.PublicRead));

		return amazonS3.getUrl(bucket,fileName).toString();
	}


	// MultipartFile -> File 변환
	private Optional<File> convert(MultipartFile file) throws IOException {

		String originalFilename = file.getOriginalFilename();
		String uuid = UUID.randomUUID().toString();
		String saveFileName = uuid + "_" + originalFilename.replaceAll("\\s", "_");

		File convertFile = new File(saveFileName);

		if (convertFile.createNewFile()) {
			try (FileOutputStream fos = new FileOutputStream(convertFile)) {
				fos.write(file.getBytes());
			}
			return Optional.of(convertFile);
		}
		return Optional.empty();
	}

	@Override
	public void delete(String imageUrl,String dirName){
		try{
			String decodeUrl=extractAndDecodePath(imageUrl,dirName);
			amazonS3.deleteObject(bucket, decodeUrl);
		}catch(UnsupportedEncodingException e){
			System.out.println("디코딩 중 오류가 발생했습니다: " + e.getMessage());
		}

	}


	public static String extractAndDecodePath(String url, String dirName) throws UnsupportedEncodingException {
		// ".com/" 이후의 경로 추출
		System.out.println(url);
		int startIndex = url.indexOf(dirName+"/");
		String path = url.substring(startIndex);

		// 경로 전체를 URL 디코딩
		String decodedPath = URLDecoder.decode(path, "UTF-8");

		return decodedPath;
	}


}