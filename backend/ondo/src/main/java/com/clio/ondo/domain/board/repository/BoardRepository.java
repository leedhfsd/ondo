package com.clio.ondo.domain.board.repository;


import com.clio.ondo.domain.board.model.Board;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
//Board 도메인 객체를 처리할 때 ID를 ObjectId로 처리
public interface BoardRepository extends MongoRepository<Board, ObjectId> {
}
