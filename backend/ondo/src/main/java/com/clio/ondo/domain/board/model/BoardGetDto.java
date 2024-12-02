package com.clio.ondo.domain.board.model;

import java.util.Date;
import java.util.List;

import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Data;

@Data
public class BoardGetDto {
	@Id
	private String _id; //식별자
	private String title;   //제목
	private String content; //내용
	private Date created_at;    //작성일
	private int views;  //조회수
	private String member_id;   //작성자
	private String member_name;
	private String member_url;  // 작성자 프로필 url
	private List<String> imageUrl; //이미지 url 리스트

	public BoardGetDto(Board board) {
		this._id = board.get_id();
		this.title = board.getTitle();
		this.content = board.getContent();
		this.created_at = board.getCreated_at();
		this.views = board.getViews();
		this.member_id = board.getMember_id();
		this.member_name = board.getMember_name();
		this.imageUrl = board.getImageUrl();
		// 필요한 다른 필드도 매핑
	}
}
