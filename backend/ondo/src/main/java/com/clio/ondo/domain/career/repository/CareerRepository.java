package com.clio.ondo.domain.career.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.clio.ondo.domain.career.model.Career;

@Repository
public interface CareerRepository extends JpaRepository<Career,Long> {
	Optional<List<Career>> findByCounselorId(Long counselorId);
}
