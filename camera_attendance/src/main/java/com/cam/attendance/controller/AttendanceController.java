package com.cam.attendance.controller;

import java.io.File;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cam.attendance.domain.Attendance;
import com.cam.attendance.domain.User;
import com.cam.attendance.repository.AttendanceRepository;
import com.cam.attendance.service.FaceRecognitionService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
	
	@Autowired
	AttendanceRepository attendanceRepo;
	
	@Autowired
	FaceRecognitionService faceRecognitionService;

	@PostMapping("/mark/{employeeId}")
	public ResponseEntity<?> markAttendance(@RequestParam("imageName") MultipartFile liveImage,
	                                        @PathVariable("employeeId") Long employeeId) {
	    System.err.println("Received file: " + liveImage.getOriginalFilename());

	    try {
	        if (liveImage.isEmpty()) {
	            return ResponseEntity.badRequest().body("Image file is empty.");
	        }

	        File tempFile = File.createTempFile("live_", ".jpg");
	        liveImage.transferTo(tempFile);
	        System.err.println("Saved to: " + tempFile.getAbsolutePath());

	        if (!tempFile.exists()) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                    .body("Failed to save uploaded image.");
	        }

	        User matchedEmployee = faceRecognitionService.findMatchingEmployee(tempFile, employeeId);

	        tempFile.delete();

	        if (matchedEmployee != null) {
	            Attendance attendance = new Attendance();
	            attendance.setUser(matchedEmployee);
	            attendance.setCheckInTime(LocalDateTime.now());
	            attendance.setImageName(liveImage.getOriginalFilename());
	            attendanceRepo.save(attendance);
	            return ResponseEntity.ok("Attendance marked for " + matchedEmployee.getName());
	        } else {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No match found");
	        }

	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error in face matching");
	    }
	}


}
