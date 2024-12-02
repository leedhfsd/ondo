package com.clio.ondo.domain.board.service;

import com.clio.ondo.domain.board.model.Comment;
import com.clio.ondo.domain.board.model.CommentGetDto;
import com.clio.ondo.domain.board.repository.CommentRepository;
import com.clio.ondo.domain.board.repository.CustomCommentRepositoryImpl;

import java.util.List;
import java.util.Optional;

import com.clio.ondo.domain.member.service.MemberService;
import com.clio.ondo.domain.moderation.model.FilteringResponse;
import com.clio.ondo.domain.moderation.service.ModerationService;
import com.clio.ondo.global.exception.board.ModerationException;
import com.clio.ondo.global.exception.member.NotFoundException;
import com.clio.ondo.global.exception.member.UnauthorizedException;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CommentServiceImpl implements CommentService {

  @Autowired
  CommentRepository commentRepository;
  @Autowired
  CustomCommentRepositoryImpl customCommentRepositoryImpl;
  @Autowired
  ModerationService moderationService;
  @Autowired
  MemberService memberService;

  @Override
  public void saveComment(Comment comment) {
    List<FilteringResponse> contentResponse = moderationService.inspectBadWord(comment.getContent());
    if(!contentResponse.isEmpty() && contentResponse.get(0).getScore() > 0.5){
      throw new ModerationException(contentResponse.get(0).getAttributeName() + ": " + contentResponse.get(0).getScore());
    }

    commentRepository.save(comment);
  }

  @Override
  public void deleteComment(ObjectId commentId, Long memberId) {
    Optional<Comment> existingCommentOpt = commentRepository.findById(commentId);

    //존재하는 댓글일 때
    if (existingCommentOpt.isPresent()) {
      Comment existingComment = existingCommentOpt.get();
      if (existingComment.getMemberId().equals(memberId.toString())) {
        commentRepository.deleteById(commentId);
      } else {
        //소유주가 아니기에 예외처리
        throw new UnauthorizedException("잘못된 접근입니다.");
      }
    } else {
      // 게시글이 존재하지 않을 경우 예외 처리
      throw new NotFoundException("존재하지 않은 댓글입니다.");
    }
    commentRepository.deleteById(commentId);
  }

  @Override
  public void updateComment(ObjectId commentId, Comment modifiedComment, Long memberId) {
    Optional<Comment> existingCommentOpt = commentRepository.findById(commentId);

    //존재하는 댓글일 때
    if (existingCommentOpt.isPresent()) {
      Comment existingComment = existingCommentOpt.get();
      if (existingComment.getMemberId().equals(memberId.toString())) {
        List<FilteringResponse> contentResponse = moderationService.inspectBadWord(modifiedComment.getContent());
        if(!contentResponse.isEmpty() && contentResponse.get(0).getScore() > 0.5){
          throw new ModerationException(contentResponse.get(0).getAttributeName() + ": " + contentResponse.get(0).getScore());
        }

        customCommentRepositoryImpl.updateComment(commentId, modifiedComment);
      } else {
        //소유주가 아니기에 예외처리
        throw new UnauthorizedException("잘못된 접근입니다.");
      }
    } else {
      // 게시글이 존재하지 않을 경우 예외 처리
      throw new NotFoundException("존재하지 않은 댓글입니다.");
    }
  }

  @Override
  public Page<CommentGetDto> getComments(Pageable pageable, String articleId) {
    Page<Comment> comments = commentRepository.findByArticleId(articleId, pageable);
    Page<CommentGetDto> commentGetDtos = comments.map(comment -> new CommentGetDto(comment));
    for(CommentGetDto commentGetDto : commentGetDtos){
      commentGetDto.setMember_url(memberService.findOne(Long.parseLong(commentGetDto.getMemberId())).getProfileUrl());
    }
    return commentGetDtos;
  }
}
