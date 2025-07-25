package com.cam.attendance.service;

import java.io.File;

import com.cam.attendance.domain.User;

public interface FaceRecognitionService {

	User findMatchingEmployee(File tempFile, Long employeeId);

}
