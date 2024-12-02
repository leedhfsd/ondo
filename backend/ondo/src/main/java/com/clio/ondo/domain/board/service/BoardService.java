package com.clio.ondo.domain.board.service;

import com.clio.ondo.domain.board.model.Board;
import com.clio.ondo.domain.board.model.BoardGetDto;
import com.clio.ondo.domain.board.model.BoardUpdateDto;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface BoardService {

  //    public List<Board> getAricles();

  Page<BoardGetDto> getArticles(Pageable pageble);

  //Board saveArticle(Board board);
  Board saveArticle(Board board) throws IOException;

  Board saveArticleImage(ObjectId boardId, MultipartFile file, Long memberId) throws IOException;

  void deleteArticle(ObjectId articleId,Long   memberId);

  //void updateArticle(String articleId, Board modifiedArticle, Long memberId);
  void updateArticle(String articleId, BoardUpdateDto modifiedArticle,Long memberId) throws IOException;

  Board updateArticleImage(ObjectId boardId, MultipartFile file, Long memberId) throws IOException;

  Optional<Board> getArticle(ObjectId articleId);

  public List<Board> searchArticles(String searchWord) ;

}

