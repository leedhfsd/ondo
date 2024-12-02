package com.clio.ondo.domain.counselDetail.repository;

import org.springframework.data.jpa.repository.JpaRepository;


import com.clio.ondo.domain.counselDetail.model.CounselDetail;


public interface CounselDetailRepository extends JpaRepository<CounselDetail, Long> {
	public CounselDetail findCounselDetailById(Long id);
}
