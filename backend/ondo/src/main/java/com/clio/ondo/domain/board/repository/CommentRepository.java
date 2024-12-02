package com.clio.ondo.domain.board.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.clio.ondo.domain.board.model.Comment;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends MongoRepository<Comment, ObjectId> {
  Page<Comment> findByArticleId(String articleId, Pageable pageable);
}
