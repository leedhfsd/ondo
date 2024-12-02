package com.clio.ondo.domain.board.repository;

import com.clio.ondo.domain.board.model.Comment;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomCommentRepository {
  public void updateComment(ObjectId commentId, Comment modifiedComment);
}