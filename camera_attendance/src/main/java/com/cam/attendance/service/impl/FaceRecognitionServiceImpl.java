package com.cam.attendance.service.impl;

import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cam.attendance.domain.User;
import com.cam.attendance.repository.UserRepository;
import com.cam.attendance.service.FaceRecognitionService;
import com.cam.attendance.utils.Constants;
import com.cam.attendance.utils.FaceMatcher;

@Service
public class FaceRecognitionServiceImpl implements FaceRecognitionService {
	
	@Autowired
	private UserRepository employeeRepository;

	@Autowired
	private FaceMatcher faceMatcher;

	@Override
	public User findMatchingEmployee(File inputFace, Long employeeId) {
		User employee = employeeRepository.findById(employeeId)
			    .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + employeeId));
		System.err.println(employee.getName());
		File storedFace = new File(Constants.Images_path + employee.getImageName());

		boolean match = faceMatcher.compareFaces(storedFace, inputFace);
		System.err.println(match);
		if (match) {
			return employee;
		}

		return null;
	}


}
