package com.clio.ondo.domain.counselDetail.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clio.ondo.domain.counselDetail.model.CounselDetail;
import com.clio.ondo.domain.counselDetail.model.MemberForCounselorDto;
import com.clio.ondo.domain.counselDetail.model.ReservationWithDetailDto;

@Service
public interface CounselDetailService {
	void save(CounselDetail counselDetail);

	MemberForCounselorDto getMemberForCounselor(Long memberId);

	List<ReservationWithDetailDto> getRerservationWithDetail(Long memberId, Long counselorId, Pageable pageable);

	@Transactional
	ReservationWithDetailDto updateReservationCounselingDetail(Long counselorId,
		ReservationWithDetailDto reservationWithDetailDto);
}
