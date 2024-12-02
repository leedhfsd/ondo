package com.clio.ondo.domain.image.model;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Document(collection="ArticleImage")
@Getter
@Builder
@AllArgsConstructor
public class AritcleImage {

	@Id
	private ObjectId id;
	private Long articleId; //외래키
	private List<String> imageUrlList; //이미지 url 담는 리스트

}
