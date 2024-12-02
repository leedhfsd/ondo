package com.clio.ondo.domain.image.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.clio.ondo.domain.image.model.AritcleImage;

public interface ImageRepository extends MongoRepository<AritcleImage, ObjectId> {
}
