package com.clio.ondo.domain.counselDetail.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clio.ondo.domain.counselDetail.model.CounselDetail;
import com.clio.ondo.domain.counselDetail.model.MemberForCounselorDto;
import com.clio.ondo.domain.counselDetail.model.ReservationWithDetailDto;
import com.clio.ondo.domain.counselDetail.repository.CounselDetailRepository;
import com.clio.ondo.domain.member.model.Member;
import com.clio.ondo.domain.member.repository.MemberRepository;
import com.clio.ondo.domain.reservation.model.Reservation;
import com.clio.ondo.domain.reservation.repository.ReservationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CounselDetailServiceImpl implements CounselDetailService {
	private final CounselDetailRepository counselDetailRepository;
	private final ReservationRepository reservationRepository;
	private final MemberRepository memberRepository;

	@Override
	public void save(CounselDetail counselDetail){
		counselDetailRepository.save(counselDetail);
	}

	@Override
	public MemberForCounselorDto getMemberForCounselor(Long memberId){
		Member member = memberRepository.findById(memberId).orElse(null);
		MemberForCounselorDto memberForCounselorDto = MemberForCounselorDto.builder()
			.memberId(member.getId())
			.memberName(member.getName())
			.birthDate(member.getBirthDate())
			.gender(member.getGender())
			.build();

		return memberForCounselorDto;
	}

	@Override
	public List<ReservationWithDetailDto> getRerservationWithDetail(Long memberId, Long counselorId, Pageable pageable){
		Page<Reservation> reservations = reservationRepository.findByMemberIdAndCounselorIdOrderByReservationDateDesc(memberId, counselorId, pageable);
		List<ReservationWithDetailDto> reservationWithDetailDtos = new ArrayList<>();
		for(Reservation reservation : reservations){
			CounselDetail counselDetail = counselDetailRepository.findCounselDetailById(reservation.getId());
			ReservationWithDetailDto reservationWithDetailDto = ReservationWithDetailDto.builder()
				.reservationId(reservation.getId())
				.reservationDate(reservation.getReservationDate())
				.counselingReservationDetail(reservation.getDetail())
				.counsellingDetail(counselDetail.getContent())
				.build();

			reservationWithDetailDtos.add(reservationWithDetailDto);
		}

		return reservationWithDetailDtos;
	}

	@Override
	@Transactional
	public ReservationWithDetailDto updateReservationCounselingDetail(Long counselorId,
		ReservationWithDetailDto reservationWithDetailDto){
		Reservation reservation = reservationRepository.findById(reservationWithDetailDto.getReservationId()).orElse(null);
		CounselDetail counselDetail = counselDetailRepository.findCounselDetailById(reservation.getId());
		counselDetail.updateContent(reservationWithDetailDto.getCounsellingDetail());

		ReservationWithDetailDto updated = ReservationWithDetailDto.builder()
			.reservationId(reservation.getId())
			.reservationDate(reservation.getReservationDate())
			.counselingReservationDetail(reservation.getDetail())
			.counsellingDetail(counselDetail.getContent())
			.build();

		return updated;
	}
}
