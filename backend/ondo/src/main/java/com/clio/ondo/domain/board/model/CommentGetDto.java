package com.clio.ondo.domain.board.model;

import java.util.Date;
import lombok.Data;

@Data
public class CommentGetDto {
	private String id; //식별자
	private String content; //내용
	private Date createdAt;    //작성일
	private String memberId;
	private String memberName;
	private String member_url;
	private String articleId;

	public CommentGetDto(Comment comment) {
		id = comment.getId();
		content = comment.getContent();
		createdAt = comment.getCreatedAt();
		memberId = comment.getMemberId();
		memberName = comment.getMemberName();
		articleId = comment.getArticleId();
	}
}
