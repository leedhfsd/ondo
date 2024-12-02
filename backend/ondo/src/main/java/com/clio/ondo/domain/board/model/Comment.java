package com.clio.ondo.domain.board.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Id;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "comments")
@Getter
@Setter
public class Comment {

  @Id
  private String id; //식별자
  private String content; //내용
  private Date createdAt;    //작성일
  @JsonProperty("member_id")
  @Field("member_id")
  private String memberId;
  @JsonProperty("member_name")
  @Field("member_name")
  private String memberName;
  @JsonProperty("article_id")
  @Field("article_id")
  private String articleId;

  // 내용을 바꾸는 메서드
  public void changeContent(String newContent) {
    this.content = newContent;
  }

  public void settingMemberId(String memberId) {
    this.memberId = memberId;
  }

  //생성일 초기화 하는 함수
  public void settingCreatedDate() {
    this.createdAt = new Date();
  }
}
