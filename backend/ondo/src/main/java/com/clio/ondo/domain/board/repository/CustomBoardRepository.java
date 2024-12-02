package com.clio.ondo.domain.board.repository;

import com.clio.ondo.domain.board.model.Board;
import com.clio.ondo.domain.board.model.BoardUpdateDto;

import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomBoardRepository  {

  void updateArticle(ObjectId articleId, BoardUpdateDto modifiedArticle);

  public List<Board> searchArticles(String searchWord) ;
}
