package com.cam.attendance.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cam.attendance.domain.Attendance;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

}
