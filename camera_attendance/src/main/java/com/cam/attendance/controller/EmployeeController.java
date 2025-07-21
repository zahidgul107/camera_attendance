package com.cam.attendance.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cam.attendance.domain.Employee;
import com.cam.attendance.repository.EmployeeRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

	@Autowired
	EmployeeRepository empRepo;
	
	@Autowired
	ObjectMapper objMapper;

	@PostMapping("/add")
	public ResponseEntity<?> addEmployee(@RequestParam("employee") String employeeJson,
			@RequestParam("imageName") MultipartFile imageName) {
		System.err.println("Employee: " + employeeJson);
		
		Employee employee = null;
		try {
			employee = objMapper.readValue(employeeJson, Employee.class);
		} catch (JsonProcessingException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Put valid product json");
		}

		try {

			if (imageName != null && !imageName.isEmpty()) {
				uploadImage(imageName);
				employee.setImageName(imageName.getOriginalFilename());
			}

			Employee savedEmployee = empRepo.save(employee);

			return new ResponseEntity<>(savedEmployee, HttpStatus.CREATED);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public void uploadImage(MultipartFile imageName) {
		if (imageName != null) {
			try {
				File saveFile = new File(com.cam.attendance.utils.Constants.PATH);
				saveFile.mkdirs();
				Path path = Paths.get(saveFile.getAbsolutePath() + File.separator + imageName.getOriginalFilename());
				Files.copy(imageName.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

	}

}
