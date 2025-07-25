package com.cam.attendance.service;

import java.security.Principal;
import java.util.Map;

import org.springframework.data.domain.Page;

import com.cam.attendance.domain.Attendance;

import jakarta.servlet.http.HttpSession;

public interface AttendanceService {

	Map<String, Object> getCount(Principal principal);

	Page<Attendance> getPagAttendance(int page, HttpSession session, Principal principal);

}
