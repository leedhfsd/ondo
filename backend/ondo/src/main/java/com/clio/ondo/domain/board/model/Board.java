package com.clio.ondo.domain.board.model;

import jakarta.persistence.Id;
import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection ="articles")
@Getter
public class Board {
    @Id
    private String _id; //식별자
    private String title;   //제목
    private String content; //내용
    private Date created_at;    //작성일
    private int views;  //조회수
    private String member_id;   //작성자
    private List<String> imageUrl; //이미지 url 리스트

    private String member_name;
    // 제목을 바꾸는 메서드
    public void changeTitle(String newTitle) {
        this.title = newTitle;
    }

    // 내용을 바꾸는 메서드
    public void changeContent(String newContent) {
        this.content = newContent;
    }

    //생성일 초기화 하는 함수
    public void settingCreatedDate(){
        this.created_at = new Date();
    }

    //member id 값 넣는 메서드
    public void settingMemberId(String memberId){
        this.member_id = memberId;
    }
    //조회 수 초기화
    public void settingViews(){
        this.views = 0;
    }
    //이미지 url 값 넣는 메서드
    public void settingImageUrl(List<String> imageUrl){
        this.imageUrl=imageUrl;
    }


}
