package com.clio.ondo.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

import lombok.AllArgsConstructor;

@Configuration
@PropertySource("classpath:s3.properties")
@EnableConfigurationProperties
public class S3Config {
	// 공개키 가져오기
	@Value("${cloud.aws.credentials.accessKey}")
	private String accessKey;

	// 비밀키 가져오기
	@Value("${cloud.aws.credentials.secretKey}")
	private String secretKey;

	// 지역 가져오기
	@Value("${cloud.aws.region.static}")
	private String region;

	@Bean
	public AmazonS3 amazonS3() {
		// AWS 접근키와 비밀키를 이용해서 AWSCredentials 객체 생성
		AWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);
		// AmazonS3ClientBuilder 사용해서 Amazon S3 클라이언트 생성
		// 이 빌더를 통해 자격 증명과 지역을 설정할 수 있다.
		return AmazonS3ClientBuilder.
			standard()
			.withCredentials(new AWSStaticCredentialsProvider(credentials)) //  -> AWS 자격 증명 설정 위에서 생성한 객체를 이용
			.withRegion(region) // -> S3 클라이언으가 사용할 지역 설정
			.build();
	}

}
