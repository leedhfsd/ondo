package com.clio.ondo.global.auth.jwtUtil;

import java.util.Base64;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.clio.ondo.global.auth.CounselorDetailsServiceImpl;
import com.clio.ondo.global.auth.CounselorPrincipalDetails;
import com.clio.ondo.global.auth.MemberDetailsServiceImpl;
import com.clio.ondo.global.auth.MemberPrincipalDetails;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtTokenProvider {

	private final RedisTemplate<String, String> redisTemplate;
	private final MemberDetailsServiceImpl memberDetailsService;
	private final CounselorDetailsServiceImpl counselorDetailsService;

	@Value("${spring.jwt.access-token-expiration}")
	private long accessTokenExpirationTime;

	@Value("${spring.jwt.refresh-token-expiration}")
	private long refreshTokenExpirationTime;

	@Value("${spring.jwt.secret}")
	private String secret;

	@PostConstruct
	protected void init() {
		secret = Base64.getEncoder().encodeToString(secret.getBytes());
	}

	public String getJwtTokenFromCookies(HttpServletRequest request, String cookieName) {
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			log.error(cookies.toString());
			for (Cookie cookie : cookies) {
				if (cookieName.equals(cookie.getName())) {
					return cookie.getValue();
				}
			}
		}
		return null;
	}

	public String generateAccessToken(Authentication authentication) {
		MemberPrincipalDetails userDetails = (MemberPrincipalDetails) authentication.getPrincipal();
		Claims claims = Jwts.claims().setSubject(userDetails.getMember().getEmail());
		Date now = new Date();
		Date expireDate = new Date(now.getTime() + accessTokenExpirationTime);

		return Jwts.builder()
			.setClaims(claims)
			.claim("id", userDetails.getMember().getId())
			.claim("role", userDetails.getMember().getRole())
			.claim("type", "access")
			.setIssuedAt(now)
			.setExpiration(expireDate)
			.signWith(SignatureAlgorithm.HS512, secret)
			.compact();
	}

	public String generateRefreshToken(Authentication authentication) {
		MemberPrincipalDetails userDetails = (MemberPrincipalDetails) authentication.getPrincipal();
		Claims claims = Jwts.claims().setSubject(userDetails.getMember().getEmail());
		Date now = new Date();
		Date expireDate = new Date(now.getTime() + refreshTokenExpirationTime);

		String refreshToken = Jwts.builder()
			.setClaims(claims)
			.claim("id", userDetails.getMember().getId())
			.claim("role", userDetails.getMember().getRole())
			.setIssuedAt(now)
			.setExpiration(expireDate)
			.signWith(SignatureAlgorithm.HS512, secret)
			.compact();
		String key = "refresh-token:" + userDetails.getMember().getEmail();
		redisTemplate.opsForValue().set(
			key,
			refreshToken,
			refreshTokenExpirationTime,
			TimeUnit.MILLISECONDS
		);
		return refreshToken;
	}

	public String generateCounselorAccessToken(Authentication authentication) {
		CounselorPrincipalDetails userDetails = (CounselorPrincipalDetails) authentication.getPrincipal();
		Claims claims = Jwts.claims().setSubject(userDetails.getCounselor().getCounselorId());
		Date now = new Date();
		Date expireDate = new Date(now.getTime() + accessTokenExpirationTime);

		return Jwts.builder()
				.setClaims(claims)
				.claim("id", userDetails.getCounselor().getId())
				.claim("role", userDetails.getCounselor().getRole())
				.claim("type", "access")
				.setIssuedAt(now)
				.setExpiration(expireDate)
				.signWith(SignatureAlgorithm.HS512, secret)
				.compact();
	}

	public String generateCounselorRefreshToken(Authentication authentication) {
		CounselorPrincipalDetails userDetails = (CounselorPrincipalDetails) authentication.getPrincipal();
		Claims claims = Jwts.claims().setSubject(userDetails.getCounselor().getCounselorId());
		Date now = new Date();
		Date expireDate = new Date(now.getTime() + refreshTokenExpirationTime);

		String refreshToken = Jwts.builder()
				.setClaims(claims)
				.claim("id", userDetails.getCounselor().getId())
				.claim("role", userDetails.getCounselor().getRole())
				.setIssuedAt(now)
				.setExpiration(expireDate)
				.signWith(SignatureAlgorithm.HS512, secret)
				.compact();
		String key = "refresh-token:" + userDetails.getCounselor().getCounselorId();
		redisTemplate.opsForValue().set(
				key,
				refreshToken,
				refreshTokenExpirationTime,
				TimeUnit.MILLISECONDS
		);
		return refreshToken;
	}

	public Claims decodeJwt(String token) {
		return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
	}

	public boolean isTokenBlacklisted(String token) {
		return redisTemplate.opsForValue().get("blacklist:" + token) == null;
	}

	public boolean validateToken(String token) {
		try {
			Claims claims = decodeJwt(token);
			return claims.getExpiration().after(new Date());
		} catch (JwtException e) {
			return false;
		}
	}

	public String getJwtTokenFromRequestHeader(HttpServletRequest request) {
		String bearerToken = request.getHeader("Authorization");
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7);
		}
		return null;
	}

	// 토큰에서 id 가져오는 함수.
	public Long getIdFromToken(String token) {
		return decodeJwt(token).get("id", Long.class);
	}

	public Authentication getMemberAuthentication(String token) {
		String username = decodeJwt(token).getSubject();
		MemberPrincipalDetails userDetails = (MemberPrincipalDetails) memberDetailsService.loadUserByUsername(username);
		return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
	}

	public Authentication getCounselorAuthentication(String token) {
		String username = decodeJwt(token).getSubject();
		CounselorPrincipalDetails userDetails = (CounselorPrincipalDetails) counselorDetailsService.loadUserByUsername(username);
		return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
	}

	public boolean hasClaim(Claims claims, String claimKey, String claimValue) {
		return claimValue.equals(claims.get(claimKey, String.class));
	}

	public void setHeaderAccessToken(HttpServletResponse response, String accessToken) {
		response.setHeader("authorization", "bearer "+ accessToken);
	}

	public void setHeaderRefreshToken(HttpServletResponse response, String refreshToken) {
		response.setHeader("refreshToken", "bearer "+ refreshToken);
	}

	public long getExpirationTime(String token) {
		Claims claims = decodeJwt(token);
		return claims.getExpiration().getTime();
	}
}
