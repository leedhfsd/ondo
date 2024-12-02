package com.clio.ondo.domain.member.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.clio.ondo.domain.member.model.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {
	Optional<Member> findByEmail(String email);

	Optional<Member> findByNickname(String nickname);

	@Query("SELECT m.id FROM Member m WHERE m.email = :email")
	Long findIdByEmail(@Param("email") String email);
}
