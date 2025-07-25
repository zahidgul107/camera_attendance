package com.cam.attendance.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cam.attendance.service.AttendanceService;

import lombok.AllArgsConstructor;

//@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
	
	@Autowired
	private AttendanceService attendanceSer;
	
	@GetMapping("/getDashboardCount")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('EMPLOYEE')")
	public ResponseEntity<Map<String, Object>> getCount(Principal principal) {
		System.err.println("testing");
		Map<String, Object> response = attendanceSer.getCount(principal);
		return ResponseEntity.ok(response);
	}

}
