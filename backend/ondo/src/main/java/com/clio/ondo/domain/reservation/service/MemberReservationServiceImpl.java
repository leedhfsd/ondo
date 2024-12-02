package com.clio.ondo.domain.reservation.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clio.ondo.domain.counselDetail.model.CounselDetail;
import com.clio.ondo.domain.counselDetail.repository.CounselDetailRepository;
import com.clio.ondo.domain.counselDetail.service.CounselDetailService;
import com.clio.ondo.domain.counselor.model.Counselor;
import com.clio.ondo.domain.counselor.repository.CounselorRepository;
import com.clio.ondo.domain.member.model.Member;
import com.clio.ondo.domain.member.repository.MemberRepository;
import com.clio.ondo.domain.reservation.model.Reservation;
import com.clio.ondo.domain.reservation.model.dto.ReservationRequestDto;
import com.clio.ondo.domain.reservation.model.dto.ReservationResponseDto;
import com.clio.ondo.domain.reservation.repository.ReservationRepository;
import com.clio.ondo.global.auth.jwtUtil.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class MemberReservationServiceImpl implements MemberReservationService{

	private final ReservationRepository reservationRepository;
	private final MemberRepository memberRepository;
	private final CounselorRepository counselorRepository;
	private final CounselDetailRepository counselDetailRepository;
	private final JwtTokenProvider jwtTokenProvider;
	private final CounselDetailService counselDetailService;

	//나의 예약 내역 가져오기
	@Override
	public List<ReservationResponseDto> getReservationList(Long memberId){
		List<Reservation> myList=reservationRepository.findByMemberId(memberId);
		List<ReservationResponseDto> reservationList=new ArrayList<>();

		for (Reservation reservation : myList) {
			ReservationResponseDto dto = new ReservationResponseDto();
			dto.setCounselDetailId(reservation.getId()); // CounselDetail의 id는 Reservation의 id와 동일
			dto.setId(reservation.getId());
			dto.setMemberId(memberId);
			dto.setReservationDate(reservation.getReservationDate());
			dto.setDetail(reservation.getDetail());
			dto.setCounselingUrl(reservation.getCounselingUrl());

			// Reservation 엔티티에서 Counselor 객체를 가져와서 counselorId 추출
			Counselor counselor = reservation.getCounselor();
			if (counselor != null) {
				dto.setCounselorId(counselor.getId()); // Counselor 객체에서 ID를 추출하여 설정
			}

			reservationList.add(dto);
		}

		return reservationList;
	}

	//예약 내역 삭제하기
	@Override
	@Transactional
	public void cancelReservation(Long reservationId){
		// Reservation을 조회
		Reservation reservation = reservationRepository.findById(reservationId)
			.orElseThrow(() -> new IllegalArgumentException("해당 예약이 없습니다. id=" + reservationId));

		// CounselDetail을 가져와서 삭제합니다.
		CounselDetail counselDetail = reservation.getCounselDetail();
		if (counselDetail != null) {
			counselDetailRepository.delete(counselDetail);
		}
		reservationRepository.deleteById(reservationId);
	}

	//해당 상담사의 예약 내역 가져오기
	// public List<ReservationResponseDto> getCounselorSchedule(Long counselorId){
	// 	List<Reservation> reservationList=reservationRepository.findByCounselorId(counselorId);
	// 	List<ReservationResponseDto> scheduleList=new ArrayList<>();
	//
	// 	for (Reservation reservation : reservationList) {
	// 		ReservationResponseDto dto = new ReservationResponseDto();
	// 		dto.setCounselDetailId(reservation.getId()); // CounselDetail의 id는 Reservation의 id와 동일
	// 		dto.setId(reservation.getId());
	// 		dto.setReservationDate(reservation.getReservationDate());
	// 		dto.setDetail(reservation.getDetail());
	// 		dto.setCounselingUrl(reservation.getCounselingUrl());
	//
	// 		// Reservation 엔티티에서 Counselor 객체를 가져와서 counselorId 추출
	// 		Counselor counselor = reservation.getCounselor();
	// 		if (counselor != null) {
	// 			dto.setCounselorId(counselor.getId()); // Counselor 객체에서 ID를 추출하여 설정
	// 		}
	// 		// Reservation 엔티티에서 Member 객체를 가져와서 memberId 추출
	// 		Member member = reservation.getMember();
	// 		if(member!=null){
	// 			dto.setMemberId(member.getId());
	// 		}
	//
	// 		scheduleList.add(dto);
	// 	}
	//
	// 	return scheduleList;
	//
	// }

	//해당 상담사의 예약 스케줄 가져오기. String 으로 넘겨주기
	@Override
	public List<String> getCounselorSchedule(Long counselorId){
		List<Reservation> reservationList=reservationRepository.findByCounselorId(counselorId);
		List<String> scheduleList=new ArrayList<>();

		for(Reservation reservation:reservationList){
			LocalDateTime time=reservation.getReservationDate();
			String formattedDateTime = time.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
			scheduleList.add(formattedDateTime);
		}

		return scheduleList;
	}

	//예약하기
	@Override
	@Transactional
	public void makeReservation(ReservationRequestDto requestDto,Long memberId){

		// memberId로 member 조회
		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new IllegalArgumentException("해당 회원이 없습니다. id=" + memberId));

		// counselorId로 counselor 조회
		Counselor counselor = counselorRepository.findById(requestDto.getCounselorId())
			.orElseThrow(() -> new IllegalArgumentException("해당 상담사가 없습니다. id=" + requestDto.getCounselorId()));


		//받은 날짜 String -> LocalDateTime 으로 변환
		String stringDate=requestDto.getReservationDate();

		// Z를 무시하고 파싱하기 위해 DateTimeFormatter 를 수정
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS");
		// LocalDateTime으로 직접 파싱
		LocalDateTime localDateTime = LocalDateTime.parse(stringDate.substring(0, 23), formatter);

		// Reservation 엔티티 생성 및 필드 설정
		Reservation reservation = new Reservation();
		reservation.setReservationDate(localDateTime);
		reservation.setDetail(requestDto.getDetail());
		reservation.setMember(member);
		reservation.setCounselor(counselor);

		CounselDetail counselDetail=new CounselDetail(reservation, null);

		reservation.setCounselDetail(counselDetail);

		// 예약 저장
		reservationRepository.save(reservation);
		counselDetailService.save(counselDetail);
	}


}
