package com.clio.ondo.domain.board.service;

import com.clio.ondo.domain.board.model.Comment;
import com.clio.ondo.domain.board.model.CommentGetDto;

import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CommentService {
  public void saveComment(Comment comment);

  void deleteComment(ObjectId commentId,Long memberId);

  void updateComment(ObjectId commentId, Comment modifiedComment,Long memberId);

  public Page<CommentGetDto> getComments(Pageable pageble,String articleId);
}