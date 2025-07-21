package com.cam.attendance.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cam.attendance.domain.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

}
