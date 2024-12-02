package com.clio.ondo.domain.board.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.clio.ondo.domain.board.model.Board;
import com.clio.ondo.domain.board.model.BoardGetDto;
import com.clio.ondo.domain.board.model.BoardUpdateDto;
import com.clio.ondo.domain.board.repository.BoardRepository;
import com.clio.ondo.domain.board.repository.CustomBoardRepository;
import com.clio.ondo.domain.image.service.ImageService;
import com.clio.ondo.domain.member.service.MemberService;
import com.clio.ondo.domain.moderation.model.FilteringResponse;
import com.clio.ondo.domain.moderation.service.ModerationService;
import com.clio.ondo.global.exception.board.ModerationException;
import com.clio.ondo.global.exception.member.NotFoundException;
import com.clio.ondo.global.exception.member.UnauthorizedException;

@Service
public class BoardServiceImpl implements BoardService {


  @Autowired
  CustomBoardRepository customBoardRepositoryImpl;
  @Autowired
  BoardRepository boardRepository;
  @Autowired
  ModerationService moderationService;
  @Autowired
  ImageService imageService;
  @Autowired
  MemberService memberService;

    /*
    모든 게시글 가져오기
     */
//  public List<Board> getAricles() {
//    List<Board> articles=boardRepositoryImpl.findAll();
//    return articles;
//  }

  /*
  모든 게시글 가져오기 - 무한 스크롤 기능
   */
  @Override
  public Page<BoardGetDto> getArticles(Pageable pageble){
    Page<Board> boardPage = boardRepository.findAll(pageble);
    Page<BoardGetDto> boardGetDtos = boardPage.map(board -> new BoardGetDto(board));
    for(BoardGetDto boardGetDto : boardGetDtos){
      boardGetDto.setMember_url(memberService.findOne(Long.parseLong(boardGetDto.getMember_id())).getProfileUrl());
    }
    return boardGetDtos;
  }

  @Override
  public Board saveArticle(Board board) throws IOException {
    List<FilteringResponse> titleResponse = moderationService.inspectBadWord(board.getTitle());
    if(!titleResponse.isEmpty() && titleResponse.get(0).getScore() > 0.5){
      throw new ModerationException(titleResponse.get(0).getAttributeName() + ": " + titleResponse.get(0).getScore());
    }

    List<FilteringResponse> contentResponse = moderationService.inspectBadWord(board.getContent());
    if(!contentResponse.isEmpty() && contentResponse.get(0).getScore() > 0.5){
      throw new ModerationException(contentResponse.get(0).getAttributeName() + ": " + contentResponse.get(0).getScore());
    }

    return boardRepository.save(board);
  }

  @Override
  public Board saveArticleImage(ObjectId boardId, MultipartFile file, Long memberId) throws IOException {
    Optional<Board> boardOptional = boardRepository.findById(boardId);
    Board board = boardOptional.get();
    if(!file.isEmpty()){
      List<String> imageList=new ArrayList<>();
      String imageUrl = imageService.upload(file, "board");
      imageList.add(imageUrl);
      board.settingImageUrl(imageList);
    }

    return boardRepository.save(board);
  }

  /*
  게시글 삭제
   */
  /*
  글이 존재할때 - 완
  글쓴이가 일치할 떄 => 시큐리티로 하기
  삭제 요청 - 완
  예외처리
   */
  @Override
  public void deleteArticle(ObjectId articleId,Long memberId) {
    Optional<Board> existingArticleOpt = boardRepository.findById(articleId);
    if (existingArticleOpt.isPresent()) {
      //요청 보낸 사람과 글의 글쓴이가 동일할 경우에만 레포지토리로 옮겨가기
      Board existingArticle = existingArticleOpt.get();
      if(existingArticle.getMember_id().equals(memberId.toString())){
        //S3에 있는 이미지 삭제
        List<String> imageUrlList=existingArticle.getImageUrl();
        if(!imageUrlList.isEmpty()){
          for(String imageUrl:imageUrlList){
            imageService.delete(imageUrl,"board");
          }
        }
        boardRepository.deleteById(articleId);
      }
      else{
        //소유주가 아니기에 예외처리
        throw new UnauthorizedException("잘못된 접근입니다.");
      }
    } else {
      // 게시글이 존재하지 않을 경우 예외 처리
      throw new NotFoundException("존재하지 않은 게시글입니다.");
    }
  }

  /*
  게시글 수정
   */
  /*
  글이 존재할때 - 완
  글쓴이가 일치할 떄 => 시큐리티로 하기
  업데이트 요청 - 완
  예외처리
   */
  @Override
  public void updateArticle(String articleId, BoardUpdateDto modifiedArticle,Long memberId) throws IOException{
    ObjectId objectArtilceId = new ObjectId(articleId);
    Optional<Board> existingArticleOpt = boardRepository.findById(objectArtilceId);
    if (existingArticleOpt.isPresent()) {
      //요청 보낸 사람과 글의 글쓴이가 동일할 경우에만 레포지토리로 옮겨가기
      Board existingArticle = existingArticleOpt.get();
      if(existingArticle.getMember_id().equals(memberId.toString())){
        List<FilteringResponse> titleResponse = moderationService.inspectBadWord(modifiedArticle.getTitle());
        if(!titleResponse.isEmpty() && titleResponse.get(0).getScore() > 0.5){
          throw new ModerationException(titleResponse.get(0).getAttributeName() + ": " + titleResponse.get(0).getScore());
        }

        List<FilteringResponse> contentResponse = moderationService.inspectBadWord(modifiedArticle.getContent());
        if(!contentResponse.isEmpty() && contentResponse.get(0).getScore() > 0.5){
          throw new ModerationException(contentResponse.get(0).getAttributeName() + ": " + contentResponse.get(0).getScore());
        }
        customBoardRepositoryImpl.updateArticle(objectArtilceId,modifiedArticle);
      }
      else{
        //소유주가 아니기에 예외처리
        throw new UnauthorizedException("잘못된 접근입니다.");
      }
    } else {
      // 게시글이 존재하지 않을 경우 예외 처리
      throw new NotFoundException("존재하지 않은 게시글입니다.");
    }
  }

  @Override
  public Board updateArticleImage(ObjectId boardId, MultipartFile file, Long memberId) throws IOException {
    Optional<Board> boardOptional = boardRepository.findById(boardId);
    Board board = boardOptional.get();
    //S3에 있는 원래 이미지 삭제
    List<String> imageUrlList=board.getImageUrl();
    if(!imageUrlList.isEmpty()){
      for(String imageUrl:imageUrlList){
        imageService.delete(imageUrl,"board");
      }
    }
    //수정 시 들어온 이미지 재업로드
    if( file !=null && !file.isEmpty() ){
      List<String> imageList=new ArrayList<>();
      String imageUrl = imageService.upload(file, "board");
      imageList.add(imageUrl);
      board.settingImageUrl(imageList);
    }

    return boardRepository.save(board);
  }

  /*
  게시글 상세보기
   */
  @Override
  public Optional<Board> getArticle(ObjectId articleId) {
    return boardRepository.findById(articleId);
  }

  /*
    게시글 검색
    검색어 기반으로 이름이랑 제목 다 찾아야함
 */
  @Override
  public List<Board> searchArticles(String searchWord)  {
    return customBoardRepositoryImpl.searchArticles(searchWord);
  }

}


