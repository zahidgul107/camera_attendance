package com.cam.attendance.service;

import java.io.File;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cam.attendance.domain.Employee;
import com.cam.attendance.repository.EmployeeRepository;
import com.cam.attendance.utils.Constants;
import com.cam.attendance.utils.FaceMatcher;

@Service
public class FaceRecognitionService {

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private FaceMatcher faceMatcher;

	public Employee findMatchingEmployee(File inputFace, Long employeeId) {
		Employee employee = employeeRepository.findById(employeeId)
			    .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + employeeId));

		File storedFace = new File(Constants.PATH + employee.getImageName());

		boolean match = faceMatcher.compareFaces(storedFace, inputFace);
		if (match) {
			return employee;
		}

		return null;
	}

}
