package com.clio.ondo.domain.board.controller;

import com.clio.ondo.domain.board.model.Comment;
import com.clio.ondo.domain.board.model.CommentGetDto;
import com.clio.ondo.domain.board.service.CommentServiceImpl;
import com.clio.ondo.global.ResponseVO;
import com.clio.ondo.global.auth.jwtUtil.JwtTokenProvider;
import com.clio.ondo.global.exception.board.ModerationException;
import com.clio.ondo.global.exception.member.NotFoundException;
import com.clio.ondo.global.exception.member.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/board/comment")
@Slf4j
public class CommentController {

  @Autowired
  CommentServiceImpl commentServiceImpl;
  @Autowired
  private JwtTokenProvider jwtTokenProvider;

  /*
      댓글 불러오기
   */
  @GetMapping("/{articleId}")
  public ResponseEntity<ResponseVO<Page<?>>> getComments(
      @RequestParam(name = "page", defaultValue = "0") int page,
      @RequestParam(name = "size", defaultValue = "10") int size,
      @PathVariable String articleId) {
    Pageable pageable = PageRequest.of(page, size);
    Page<CommentGetDto> comments = commentServiceImpl.getComments(pageable, articleId);
    return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("comments", comments));
  }

  /*
      댓글 작성하기
  */
  @PostMapping("")
  public ResponseEntity<ResponseVO<Void>> createComment(@RequestBody Comment comment, HttpServletRequest request) {

    String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
    // String token = jwtTokenProvider.getJwtTokenFromRequestHeader(request);
    Long memberId = jwtTokenProvider.getIdFromToken(token);

    comment.settingMemberId(memberId.toString());
    comment.settingCreatedDate();
    try{
      commentServiceImpl.saveComment(comment);
    }catch(ModerationException me){
      return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.failure(me.getMessage()));
    }
    return ResponseEntity.status(HttpStatus.CREATED).body(ResponseVO.success("Success"));
  }

  /*
      댓글 삭제
   */
  @DeleteMapping("/{commentId}")
  public ResponseEntity<ResponseVO<Void>> deleteComment(@PathVariable ObjectId commentId, HttpServletRequest request) {
    try {

      String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
      // String token = jwtTokenProvider.getJwtTokenFromRequestHeader(request);
      Long memberId = jwtTokenProvider.getIdFromToken(token);

      commentServiceImpl.deleteComment(commentId, memberId);
      return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    } catch (UnauthorizedException e) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseVO.failure("댓글 삭제 실패 : 잘못된 접근입니다."));
    } catch (NotFoundException e) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseVO.failure("댓글 삭제 실패 : 존재하지 않은 게시글에 대한 요청입니다."));
    }
  }

  /*
      댓글 수정
  */
  @PatchMapping("/{commentId}")
  public ResponseEntity<ResponseVO<Void>> updateComment(@PathVariable ObjectId commentId,
      @RequestBody Comment modifiedComment, HttpServletRequest request) {
    try {

      String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
      // String token = jwtTokenProvider.getJwtTokenFromRequestHeader(request);
      Long memberId = jwtTokenProvider.getIdFromToken(token);

      commentServiceImpl.updateComment(commentId, modifiedComment, memberId);
      return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    } catch (UnauthorizedException e) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseVO.failure("댓글 수정 실패 : 잘못된 접근입니다."));
    } catch (NotFoundException e) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseVO.failure("댓글 수정 실패 : 존재하지 않은 게시글에 대한 요청입니다."));
    } catch (ModerationException me) {
      return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.failure(me.getMessage()));
    }
  }
}
