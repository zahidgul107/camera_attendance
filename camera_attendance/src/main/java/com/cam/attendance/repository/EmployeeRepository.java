package com.cam.attendance.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cam.attendance.domain.User;

public interface EmployeeRepository extends JpaRepository<User, Long> {

}
