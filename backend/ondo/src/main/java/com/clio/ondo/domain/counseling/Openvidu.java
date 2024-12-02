package com.clio.ondo.domain.counseling;

import com.clio.ondo.domain.reservation.model.Reservation;
import com.clio.ondo.domain.reservation.repository.ReservationRepository;
import com.clio.ondo.global.auth.jwtUtil.JwtTokenProvider;
import com.clio.ondo.global.ResponseVO;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
@PropertySource("classpath:openvidu.properties")
@CrossOrigin(origins = "*")
@RestController()
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class Openvidu {

  private final JwtTokenProvider jwtTokenProvider;
  private final ReservationRepository reservationRepository;

  @Value("${OPENVIDU_URL}")
  private String OPENVIDU_URL;

  @Value("${OPENVIDU_SECRET}")
  private String OPENVIDU_SECRET;

  private OpenVidu openvidu; // OpenVidu 인스턴스를 저장할 변수

  @PostConstruct
  public void init() {
    this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
  }

  @PostMapping("/counseling/sessions")
  public ResponseEntity<ResponseVO<String>> initializeSession(@RequestBody(required = false) Map<String, Object> params, HttpServletRequest request)
      throws OpenViduJavaClientException, OpenViduHttpException {

    // 요청에서 JWT 토큰 추출
    String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
    if (token == null || token.isEmpty()) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseVO.failure("JWT 토큰이 제공되지 않았습니다."));
    }
    Long id = jwtTokenProvider.getIdFromToken(token);

    // 사용자 인증 확인
    if (id != null) {
      // 예약 ID 추출
      Long reservationId = params != null && params.containsKey("reservationId")
          ? Long.parseLong(params.get("reservationId").toString())
          : null;

      // reservationId가 존재하는지 확인
      if (reservationId != null) {
        // 임의의 sessionId 생성
        String customSessionId = UUID.randomUUID().toString();

        // 세션 속성 설정
        SessionProperties properties = SessionProperties.fromJson(params)
            .customSessionId(customSessionId)
            .build();

        Session session = openvidu.createSession(properties);

        // 데이터베이스에서 reservationId로 예약 찾기 및 counseling_url 업데이트
        Optional<Reservation> reservationOpt = reservationRepository.findById(reservationId);
        if (reservationOpt.isPresent()) {
          Reservation reservation = reservationOpt.get();
          reservation.setCounselingUrl(customSessionId);
          reservationRepository.save(reservation);

          // 성공적으로 세션 ID 반환
          return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("session_id", session.getSessionId()));
        } else {
          // 예약을 찾을 수 없는 경우
          return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseVO.failure("예약을 찾을 수 없습니다."));
        }
      } else {
        // reservationId가 제공되지 않은 경우
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseVO.failure("reservationId가 제공되지 않았습니다."));
      }
    } else {
      // 잘못된 접근
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseVO.failure("세션 생성 실패: 잘못된 접근입니다."));
    }
  }

  @PostMapping("/counseling/sessions/{sessionId}/connections")
  public ResponseEntity<ResponseVO<String>> createConnection(@PathVariable("sessionId") String sessionId,
      @RequestBody(required = false) Map<String, Object> params, HttpServletRequest request)
      throws OpenViduJavaClientException, OpenViduHttpException {
    // 요청에서 JWT 토큰 추출
    String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
    if (token == null || token.isEmpty()) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseVO.failure("JWT 토큰이 제공되지 않았습니다."));
    }
    Long id = jwtTokenProvider.getIdFromToken(token);

    Session session = openvidu.getActiveSession(sessionId); // 세션 id로 활성세션 가져오기
    if (session == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseVO.failure("세션 종료 실패: 세션을 찾을 수 없습니다."));
    }

    // sessionId로 예약 내역(reservation)을 찾고 이 예약 내역에 존재하는 id일 경우만 접근 가능
    Optional<Reservation> reservationOpt = reservationRepository.findByCounselingUrl(sessionId);
    if (!reservationOpt.isPresent()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseVO.failure("예약 내역을 찾을 수 없습니다."));
    }

    Reservation reservation = reservationOpt.get();
    if (!reservation.getMember().getId().equals(id) && !reservation.getCounselor().getId().equals(id)) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseVO.failure("접근 권한이 없습니다."));
    }

    String role = params != null && params.containsKey("role") ? params.get("role").toString() : null;
    if (role == null || (!role.equals("user") && !role.equals("counselor"))) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseVO.failure("올바른 역할 정보가 제공되지 않았습니다."));
    }

    // 역할에 따른 접근 권한 확인 - 예약내역에 없는 사용자면 접근 못하도록 함
    if (role.equals("user")) {
      if (!reservation.getMember().getId().equals(id)) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseVO.failure("접근 권한이 없습니다."));
      }
    } else if (role.equals("counselor")) {
      if (!reservation.getCounselor().getId().equals(id)) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseVO.failure("접근 권한이 없습니다."));
      }
    }

    ConnectionProperties properties = new ConnectionProperties.Builder()
        .data("{\"id\":\"" + id + "\"}")
        .build();
    Connection connection = session.createConnection(properties); // ConnectionProperties 객체를 생성
    return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("token", connection.getToken()));
  }

  @PostMapping("/counseling/sessions/{sessionId}/leave")
  public ResponseEntity<ResponseVO<String>> leaveSession(@PathVariable("sessionId") String sessionId,
      @RequestBody Map<String, Object> params, HttpServletRequest request)
      throws OpenViduJavaClientException, OpenViduHttpException {

    // 요청에서 JWT 토큰 추출
    String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
    if (token == null || token.isEmpty()) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseVO.failure("JWT 토큰이 제공되지 않았습니다."));
    }
    Long id = jwtTokenProvider.getIdFromToken(token);

    if (id != null) {
      // 세션 가져오기
      Session session = openvidu.getActiveSession(sessionId);
      if (session == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseVO.failure("세션 종료 실패: 세션을 찾을 수 없습니다."));
      }

      // 세션의 모든 연결 강제 종료
      List<Connection> connections = session.getActiveConnections();
      for (Connection connection : connections) {
        session.forceDisconnect(connection);
      }

      // 요청 본문에서 reservationId 추출
      Long reservationId = params != null && params.containsKey("reservationId")
          ? Long.parseLong(params.get("reservationId").toString())
          : null;

      if (reservationId != null) {
        // 데이터베이스에서 reservationId로 예약 찾기
        Optional<Reservation> reservationOpt = reservationRepository.findById(reservationId);
        if (reservationOpt.isPresent()) {
          Reservation reservation = reservationOpt.get();
          reservation.setCounselingUrl(null); // counseling_url 필드 지우기
          reservationRepository.save(reservation);
        } else {
          // 예약을 찾을 수 없는 경우
          return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseVO.failure("예약을 찾을 수 없습니다."));
        }
      } else {
        // reservationId가 제공되지 않은 경우
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseVO.failure("reservationId가 제공되지 않았습니다."));
      }
    } else {
      // 잘못된 접근
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ResponseVO.failure("잘못된 접근입니다."));
    }

    return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("사용자가 세션에서 퇴장되었습니다."));
  }
}
