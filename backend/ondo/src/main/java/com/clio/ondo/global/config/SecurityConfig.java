package com.clio.ondo.global.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.clio.ondo.global.auth.CounselorDetailsServiceImpl;
import com.clio.ondo.global.auth.MemberDetailsServiceImpl;
import com.clio.ondo.global.auth.OAuth.CustomOAuth2UserService;
import com.clio.ondo.global.auth.OAuth.OAuth2SuccessHandler;
import com.clio.ondo.global.auth.jwtUtil.JwtAccessDeniedHandler;
import com.clio.ondo.global.auth.jwtUtil.JwtAuthenticationEntryPoint;
import com.clio.ondo.global.auth.jwtUtil.JwtFilter;
import com.clio.ondo.global.auth.jwtUtil.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	@Bean
	public AuthenticationManager authenticationManager(
			AuthenticationConfiguration authenticationConfiguration
	) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	public static PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@RequiredArgsConstructor
	@Configuration
	@Order(1)
	public static class MemberSecurityConfig {
		private final MemberDetailsServiceImpl memberDetailsService;
		private final CustomOAuth2UserService customOAuth2UserService;
		private final OAuth2SuccessHandler oAuth2SuccessHandler;
		private final JwtTokenProvider jwtTokenProvider;
		private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
		private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
		private static final String[] AUTH_WHITELIST = {
				"/api/v1/member/login", "/api/v1/member/join", "/api/v1/member/reissue",
				"/api/v1/counselor/login", "/api/v1/counselor/join", "/api/v1/counselor/reissue", "/error",
				"/api/v1/member/oauth-success", "/favicon,ico", "oauth2/**", "login**", "/api/v1/image/upload/**", "/api/v1/alarm/fcmtoken"
		};

		@Bean
		public DaoAuthenticationProvider memberAuthenticationProvider() {
			DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
			provider.setUserDetailsService(memberDetailsService);
			provider.setPasswordEncoder(passwordEncoder());
			return provider;
		}

		@Bean
		public SecurityFilterChain memberFilterChain(HttpSecurity http) throws Exception {
			http
					.httpBasic(AbstractHttpConfigurer::disable)
					.authenticationProvider(memberAuthenticationProvider())
					.csrf(AbstractHttpConfigurer::disable)
					.sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
					.cors(Customizer.withDefaults())
					.formLogin(AbstractHttpConfigurer::disable)
					.logout(AbstractHttpConfigurer::disable)
					.authorizeRequests((authorize) -> authorize
							.requestMatchers(AUTH_WHITELIST).permitAll()
							.anyRequest().authenticated())
					.oauth2Login(oauth ->
							oauth.userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
									.successHandler(oAuth2SuccessHandler)
					)
					.exceptionHandling((exceptionHandling) -> exceptionHandling
							.authenticationEntryPoint(jwtAuthenticationEntryPoint)
							.accessDeniedHandler(jwtAccessDeniedHandler))
					.addFilterBefore(new JwtFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);
			return http.build();
		}
	}

	@RequiredArgsConstructor
	@Configuration
	@Order(2)
	public static class CounselorSecurityConfig {
		private final CounselorDetailsServiceImpl counselorDetailsService;
		private final CustomOAuth2UserService customOAuth2UserService;
		private final OAuth2SuccessHandler oAuth2SuccessHandler;
		private final JwtTokenProvider jwtTokenProvider;
		private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
		private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
		private static final String[] WHITELIST = {
				"/api/v1/counselor/login", "/api/v1/counselor/join", "/api/v1/counselor/reissue",
				"/api/v1/member/login", "/api/v1/member/join", "/api/v1/member/reissue", "/error",
				"/api/v1/member/oauth-success", "/favicon,ico", "oauth2/**", "login**", "/api/v1/image/upload/**", "/api/v1/alarm/fcmtoken"
		};

		@Bean
		public DaoAuthenticationProvider counselorAuthenticationProvider() {
			DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
			provider.setUserDetailsService(counselorDetailsService);
			provider.setPasswordEncoder(passwordEncoder());
			return provider;
		}

		@Bean
		public SecurityFilterChain counselorFilterChain(HttpSecurity http) throws Exception {
			http
					.httpBasic(AbstractHttpConfigurer::disable)
					.authenticationProvider(counselorAuthenticationProvider())
					.csrf(AbstractHttpConfigurer::disable)
					.sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
					.cors(Customizer.withDefaults())
					.formLogin(AbstractHttpConfigurer::disable)
					.logout(AbstractHttpConfigurer::disable)
					.authorizeRequests((authorize) -> authorize
							.requestMatchers(WHITELIST).permitAll()
							.requestMatchers("/api/v1/counselor/**").hasRole("COUNSELOR")
							.anyRequest().authenticated())
					.oauth2Login(oauth ->
							oauth.userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
									.successHandler(oAuth2SuccessHandler)
					)
					.exceptionHandling((exceptionHandling) -> exceptionHandling
							.authenticationEntryPoint(jwtAuthenticationEntryPoint)
							.accessDeniedHandler(jwtAccessDeniedHandler))
					.addFilterBefore(new JwtFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);
			return http.build();
		}
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();

		config.setAllowCredentials(true);
		config.setAllowedOrigins(List.of("http://localhost:5173", "https://localhost:5173", "https://localhost", "http://localhost", "i11c110.p.ssafy.io", "https://i11c110.p.ssafy.io", "http://i11c110.p.ssafy.io"));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));
		config.setExposedHeaders(List.of("*"));
		config.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}

}
