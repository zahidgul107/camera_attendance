package com.cam.attendance.service.impl;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cam.attendance.domain.Attendance;
import com.cam.attendance.domain.User;
import com.cam.attendance.repository.AttendanceRepository;
import com.cam.attendance.repository.UserRepository;
import com.cam.attendance.service.AttendanceService;

@Service
public class AttendanceServiceImpl implements AttendanceService {
	
	@Autowired
	AttendanceRepository attendanceRepo;
	
	@Autowired
	UserRepository userRepo;

	@Override
	public Map<String, Object> getCount(Principal principal) {
		User user = userRepo.findByUsername(principal.getName()).get();
		List<Attendance> listAttendance = attendanceRepo.findByUser(user);
		Map<String, Object> response = new HashMap<>();
        response.put("tasksCount", listAttendance.size());
		return response;
	}

}
