package com.cam.attendance.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

import com.cam.attendance.domain.Attendance;
import com.cam.attendance.domain.User;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

	List<Attendance> findByUser(User user);

	Page<Attendance> findAll(Specification<Attendance> spec, Pageable pageable);

}
