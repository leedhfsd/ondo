package com.clio.ondo.domain.board.repository;

import com.clio.ondo.domain.board.model.Board;
import com.clio.ondo.domain.board.model.Comment;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
@Component
public class CustomCommentRepositoryImpl implements CustomCommentRepository {

  @Autowired
  private MongoTemplate mongoTemplate;

  //id로 데이터 받아와서 modifiedCooment의 값이 null아닌 경우 setter사용해 값을 바꾸고 그걸 savs
    /*
      에러 : id로 검색 시 해당 댓글이 없는 경우
     */
  @Override
  public void updateComment(ObjectId commentId, Comment modifiedComment) {
    Query query = new Query(Criteria.where("_id").is(commentId));
    Update update = new Update()
            .set("content", modifiedComment.getContent());
    mongoTemplate.updateFirst(query, update, Comment.class);
  }

}