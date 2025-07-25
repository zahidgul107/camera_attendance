package com.cam.attendance.specification;

import java.time.LocalDate;

import org.springframework.data.jpa.domain.Specification;

import com.cam.attendance.domain.Attendance;
import com.cam.attendance.domain.User;

public class AttendanceSpecification {

	public static Specification<Attendance> betweenAttendanceDate(LocalDate fromDate, LocalDate toDate) {
		return (root, query, criteriaBuilder) -> {
            if (fromDate == null && toDate == null) {
                return criteriaBuilder.conjunction();
            }
            if (fromDate == null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("checkInTime"), toDate);
            }
            if (toDate == null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("checkInTime"), fromDate);
            }
            return criteriaBuilder.between(root.get("checkInTime"), fromDate, toDate);
        };
	}

	public static Specification<Attendance> withUser(User user) {
		return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get("user"), user);
        };
	}

}
