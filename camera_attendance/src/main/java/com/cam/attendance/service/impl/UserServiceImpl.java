package com.cam.attendance.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cam.attendance.repository.AttendanceRepository;
import com.cam.attendance.repository.UserRepository;
import com.cam.attendance.service.UserService;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	UserRepository userRepo;
	
	@Autowired
	AttendanceRepository attendanceRepo;

}
