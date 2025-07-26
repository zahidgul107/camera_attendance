package com.cam.attendance.controller;

import java.io.File;
import java.nio.file.Files;
import java.security.Principal;
import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cam.attendance.domain.Attendance;
import com.cam.attendance.domain.User;
import com.cam.attendance.dto.SearchAttendance;
import com.cam.attendance.repository.AttendanceRepository;
import com.cam.attendance.response.MessageResponse;
import com.cam.attendance.service.AttendanceService;
import com.cam.attendance.service.FaceRecognitionService;
import com.cam.attendance.service.UserService;
import com.cam.attendance.utils.CommonMethods;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpSession;

//@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

	@Autowired
	AttendanceRepository attendanceRepo;

	@Autowired
	ObjectMapper objMapper;
	
	@Autowired
	FaceRecognitionService faceRecognitionService;
	
	@Autowired
	AttendanceService attendanceSer;
	
	@Autowired
	UserService userSer;

	@PostMapping("/mark/{employeeId}")
	public ResponseEntity<?> markAttendance(@RequestParam("imageName") MultipartFile liveImage,
	                                        @PathVariable("employeeId") Long employeeId,
	                                        @RequestParam("attendance") String attendanceJson) {
	    System.err.println("Received file: " + liveImage.getOriginalFilename());
	    System.err.println("Attendance: " + attendanceJson);

	    try {
	        if (liveImage.isEmpty()) {
	            return ResponseEntity.badRequest().body("Image file is empty.");
	        }

	        // ✅ Read image bytes once
	        byte[] imageBytes = liveImage.getBytes();

	        // ✅ Save to a temp file for face recognition
	        File tempFile = File.createTempFile("live_", ".jpg");
	        Files.write(tempFile.toPath(), imageBytes);
	        System.err.println("Temp saved to: " + tempFile.getAbsolutePath());

	        if (!tempFile.exists()) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save uploaded image.");
	        }

	        User matchedEmployee = faceRecognitionService.findMatchingEmployee(tempFile, employeeId);
	        System.err.println(matchedEmployee);

	        if (matchedEmployee != null) {
	            // ✅ Now recreate a MultipartFile from imageBytes to upload the original image
	            MultipartFile recreatedMultipart = new MockMultipartFile(
	                    liveImage.getOriginalFilename(),
	                    liveImage.getOriginalFilename(),
	                    liveImage.getContentType(),
	                    imageBytes
	            );

	            CommonMethods.uploadImage(recreatedMultipart);

	            Attendance attendance = null;
	            try {
	                attendance = objMapper.readValue(attendanceJson, Attendance.class);
	                attendance.setUser(matchedEmployee);
	                attendance.setAttendanceCheckInImageName(liveImage.getOriginalFilename());
	                attendanceRepo.save(attendance);
	                tempFile.delete();
	                return ResponseEntity.ok(new MessageResponse("Attendance marked for " + matchedEmployee.getName()));
	            } catch (JsonProcessingException e) {
	                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Put valid product json");
	            }
	        } else {
	            tempFile.delete(); // 🧹 Clean up
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Face not recognized. Unable to mark attendance.");
	        }

	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error in face matching");
	    }
	}

	
	@GetMapping("/getImage/{filename:.+}")
	public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
		return CommonMethods.getImage(filename);
	}

	
/*	@PreAuthorize("hasRole('USER')")
	@PutMapping("updateTask/{id}")
	public ResponseEntity<Map<String, Object>> updateTask(@PathVariable Long id, @RequestBody TaskDTO TaskDto) {
		try {
			TaskDTO updatedTask = taskSer.updateTask(id, TaskDto);
	        Map<String, Object> response = new HashMap<>();
	        response.put("updatedTask", updatedTask);
	        response.put("message", "Task updated successfully!");
	        return new ResponseEntity<>(response, HttpStatus.CREATED);
	    } catch (Exception e) {
	        Map<String, Object> errorResponse = new HashMap<>();
	        errorResponse.put("error", "Failed to update task");
	        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}   */

/*	@PreAuthorize("hasRole('USER')")
	@GetMapping("/getTask/{id}")
	public ResponseEntity<TaskDTO> getTodo(@PathVariable("id") Long id) {
		TaskDTO taskDto = taskSer.getTodo(id);
		return new ResponseEntity<>(taskDto, HttpStatus.OK);
	}  */

/*	@PreAuthorize("hasRole('USER')")
	@GetMapping("/getAllTasks")
	public ResponseEntity<Map<String, Object>> getAllTask(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size, HttpSession session, Principal principal) {
		Map<String, Object> response = taskSer.getAllTasks(page,session, principal);
		return ResponseEntity.ok(response);
	}  */
	
	@PreAuthorize("hasRole('EMPLOYEE')")
	@GetMapping("/getPagAttendance")
	public ResponseEntity<Page<Attendance>> getPaginationTasks(@RequestParam(defaultValue = "1") int page,
			@RequestParam(defaultValue = "10") int size, HttpSession session, Principal principal) {
		Page<Attendance> response = attendanceSer.getPagAttendance(page,session, principal);
		return ResponseEntity.ok(response);
	}
	
	@PreAuthorize("hasRole('EMPLOYEE')")
	@PostMapping("/search")
	public ResponseEntity<Page<Attendance>> search(@RequestBody SearchAttendance search, HttpSession session, Principal principal) {
		Page<Attendance> response = attendanceSer.search(search,session, principal);
		return ResponseEntity.ok(response);
	}
	
	@GetMapping("/today-checkin-status")
	public ResponseEntity<?> hasCheckedInToday(Principal principal) {

	    Attendance attendance = attendanceSer.existsByUserAndDate(principal);
	    if (attendance != null) {
	    	System.err.println(attendance.getCheckInTime());
		}
	    return ResponseEntity.ok(attendance);
	}

	
	/*	@PreAuthorize("hasRole('USER')")
	@DeleteMapping("/deleteTask/{id}")
	public ResponseEntity<String> deleteTodo(@PathVariable Long id) {
	    try {
	        taskSer.deleteTask(id);
	        return ResponseEntity.ok("Task Deleted successfully!.");
	    } catch (ResourceNotFoundException ex) {
	        return ResponseEntity.badRequest().body("Task not found");
	    }
	}    */

}
