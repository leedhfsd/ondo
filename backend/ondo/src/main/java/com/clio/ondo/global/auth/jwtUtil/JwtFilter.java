package com.clio.ondo.global.auth.jwtUtil;

import java.io.IOException;

import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

	private final JwtTokenProvider jwtTokenProvider;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
		FilterChain filterChain) throws ServletException, IOException {
		String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
		try {
			if (token != null) {
				if (jwtTokenProvider.validateToken(token) && jwtTokenProvider.isTokenBlacklisted(token)) {
					Claims claims = jwtTokenProvider.decodeJwt(token);
					if (jwtTokenProvider.hasClaim(claims, "type", "access")) {
						String role = claims.get("role",String.class);
						log.error("role: {}", role);
						Authentication authentication;
						if ("ROLE_USER".equals(role)) {
							authentication = jwtTokenProvider.getMemberAuthentication(token);
						} else {
							authentication = jwtTokenProvider.getCounselorAuthentication(token);
						}
						SecurityContextHolder.getContext().setAuthentication(authentication);
					} else {
						handleRefreshToken(request, response, filterChain, claims);
						return;
					}
				}
			}
		} catch (ExpiredJwtException e) {
			log.error("token:{}",token);
			handleExpiredToken(request, response, token, e);
		} catch (RedisConnectionFailureException e) {
			SecurityContextHolder.clearContext();
		}
		filterChain.doFilter(request, response);
	}

	private void handleRefreshToken(HttpServletRequest request, HttpServletResponse response,
		FilterChain filterChain, Claims claims) throws IOException, ServletException {
		String requestURI = request.getRequestURI();
		if ("/api/v1/member/reissue".equals(requestURI) || "/api/v1/counselor/reissue".equals(requestURI)) {
			filterChain.doFilter(request, response);
		} else {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token use.");
		}
	}

	private void handleExpiredToken(HttpServletRequest request, HttpServletResponse response,
		String token, ExpiredJwtException e) throws IOException {
		Claims claims = e.getClaims();
		log.error("expired token");
		if (claims != null && jwtTokenProvider.hasClaim(claims, "type", "access")) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JwtFilter: handleExpiredToken 첫번째");
		} else {
			log.error("Refresh 토큰이 만료되었습니다.", e);
			SecurityContextHolder.clearContext();
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JWTFilter: handleExpiredToken 두번째");
		}
	}
}
