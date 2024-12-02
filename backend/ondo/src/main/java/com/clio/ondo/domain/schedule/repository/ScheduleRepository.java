package com.clio.ondo.domain.schedule.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.clio.ondo.domain.schedule.model.Schedule;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
	@Query(value = "select s from Schedule s where s.id = ?1")
	Schedule findByCounselorId(Long counselorId);
}
