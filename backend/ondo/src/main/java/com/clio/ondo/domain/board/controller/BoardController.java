package com.clio.ondo.domain.board.controller;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.clio.ondo.domain.board.model.Board;
import com.clio.ondo.domain.board.model.BoardGetDto;
import com.clio.ondo.domain.board.model.BoardUpdateDto;
import com.clio.ondo.domain.board.service.BoardService;
import com.clio.ondo.domain.member.model.dto.JoinRequestDto;
import com.clio.ondo.domain.member.service.MemberService;
import com.clio.ondo.global.ResponseVO;
import com.clio.ondo.global.auth.jwtUtil.JwtTokenProvider;
import com.clio.ondo.global.exception.board.ModerationException;
import com.clio.ondo.global.exception.member.NotFoundException;
import com.clio.ondo.global.exception.member.UnauthorizedException;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;


@RestController
@RequestMapping("/api/v1/board")
@Slf4j
public class BoardController {

  @Autowired
  private BoardService boardService;
  @Autowired
  private JwtTokenProvider jwtTokenProvider;
  @Autowired
  private MemberService memberService;

  /*
  모든 게시글 가져오기 - 무한 스크롤 구현
  param
      page: 요청한 페이지 번호
      size: 페이지당 데이터 항목의 수 ( 0  ~ 데이터 수 / size -1 )
   */
  //ResponseEntity: pring의 HTTP 응답을 나타내는 클래스
  //Pageable: 데이터베이스 쿼리에서 페이징을 적용하는 데 사용
  @GetMapping("/list")
  public ResponseEntity<ResponseVO<Page<?>>> getArticles(
          @RequestParam(name = "page", defaultValue = "0") int page,
          @RequestParam(name = "size", defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<BoardGetDto> list = boardService.getArticles(pageable);
    return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("boardList", list));
  }

  /*
  글 작성하기
   */
  @PostMapping("/article")
  public ResponseEntity<ResponseVO<?>> createArticle(HttpServletRequest request,
      @RequestBody Board board) throws IOException {
    String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
    // String token = jwtTokenProvider.getJwtTokenFromRequestHeader(request);
    Long memberId = jwtTokenProvider.getIdFromToken(token);
    board.settingMemberId(memberId.toString());
    board.settingCreatedDate();
    board.settingViews();
    Board newBoard;
    try{
      newBoard = boardService.saveArticle(board);
    }catch(ModerationException me){
      return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.failure(me.getMessage()));
    }
    return ResponseEntity.status(HttpStatus.CREATED).body(ResponseVO.success("id", newBoard.get_id()));
  }

  @PostMapping("/articleImage/{boardId}")
  public ResponseEntity<ResponseVO<?>> uploadArticleImage(HttpServletRequest request, @PathVariable ObjectId boardId,
      @RequestParam("data") MultipartFile imageList) throws IOException {
    String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
    // String token = jwtTokenProvider.getJwtTokenFromRequestHeader(request);
    Long memberId = jwtTokenProvider.getIdFromToken(token);
    Board newBoard;
    try{
      newBoard = boardService.saveArticleImage(boardId, imageList, memberId);
    }catch(ModerationException me){
      return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.failure(me.getMessage()));
    }
    return ResponseEntity.status(HttpStatus.CREATED).body(ResponseVO.success("id", newBoard.get_id()));
  }

  /*
게시글 삭제
 */
  @DeleteMapping("/{articleId}")
  public ResponseEntity<ResponseVO<Void>> deleteArticle(@PathVariable ObjectId articleId,HttpServletRequest request) {
    try{

      String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
      // String token = jwtTokenProvider.getJwtTokenFromRequestHeader(request);
      Long memberId = jwtTokenProvider.getIdFromToken(token);

      boardService.deleteArticle(articleId,memberId);
      return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ResponseVO.success("Success"));
    }catch (UnauthorizedException e){
     return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseVO.failure("게시글 삭제 실패 : 잘못된 접근입니다."));
    }catch (NotFoundException e){
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseVO.failure("게시글 삭제 실패 : 존재하지 않은 게시글에 대한 요청입니다."));
    }
  }

  /*
게시글 수정
*/
  @PatchMapping("/{articleId}")
  public ResponseEntity<ResponseVO<Void>>  updateArticle(@PathVariable String articleId,HttpServletRequest request,
      @RequestBody BoardUpdateDto modifiedArticle) throws IOException{
    try{
      String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
      // String token = jwtTokenProvider.getJwtTokenFromRequestHeader(request);
      Long memberId = jwtTokenProvider.getIdFromToken(token);

      boardService.updateArticle(articleId,modifiedArticle,memberId);
      return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ResponseVO.success("Success"));
    }catch (UnauthorizedException e){
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseVO.failure("게시글 수정 실패 : 잘못된 접근입니다."));
    }catch (NotFoundException e) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseVO.failure("게시글 수정 실패 : 존재하지 않은 게시글에 대한 요청입니다."));
    } catch(ModerationException me){
      return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.failure(me.getMessage()));
    }
  }

  @PatchMapping("/articleImage/{boardId}")
  public ResponseEntity<ResponseVO<?>> updateArticleImage(HttpServletRequest request, @PathVariable ObjectId boardId,
      @RequestParam("data") MultipartFile imageList) throws IOException {
    String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
    // String token = jwtTokenProvider.getJwtTokenFromRequestHeader(request);
    Long memberId = jwtTokenProvider.getIdFromToken(token);
    Board newBoard;
    try{
      newBoard = boardService.updateArticleImage(boardId, imageList, memberId);
    }catch(ModerationException me){
      return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.failure(me.getMessage()));
    }
    return ResponseEntity.status(HttpStatus.CREATED).body(ResponseVO.success("id", newBoard.get_id()));
  }

  /*
  게시글 검색
   */
  @GetMapping("/search") //search가 없으면 searchWord에 list라는 단어가 들어갔을때 문제 발생
  public  ResponseEntity<ResponseVO<List<?>>> searchArticles( @RequestParam(name = "searchWord")String searchWord){
    List<Board> list = boardService.searchArticles(searchWord);
    List<BoardGetDto> getList = list.stream().map(board -> new BoardGetDto(board)).toList();
    for(BoardGetDto getDto : getList){
      getDto.setMember_url(memberService.findOne(Long.parseLong(getDto.getMember_id())).getProfileUrl());
    }
    return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("boardList", getList));
  }
  /*
  게시글 상세조회
   */
  @GetMapping("/{articleId}")
  public ResponseEntity<ResponseVO<?>> getArticle(@PathVariable ObjectId articleId){
    Optional<Board> article = boardService.getArticle(articleId);
    BoardGetDto getDto = new BoardGetDto(article.get());
    getDto.setMember_url(memberService.findOne(Long.parseLong(getDto.getMember_id())).getProfileUrl());
    return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("board", getDto));
  }


}
