package com.cam.attendance.utils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.cam.attendance.exception.ResourceNotFoundException;

public class CommonMethods {

	public static void uploadImage(MultipartFile imageName) {
		if (imageName != null) {
			try {
				File saveFile = new File(com.cam.attendance.utils.Constants.Images_path);
				saveFile.mkdirs();
				Path path = Paths.get(saveFile.getAbsolutePath() + File.separator + imageName.getOriginalFilename());
				Files.copy(imageName.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

	}

	public static ResponseEntity<Resource> getImage(String filename) {
		try {
	        filename = java.net.URLDecoder.decode(filename, "UTF-8");

	        Path filePath = Paths.get(Constants.Images_path).resolve(filename).normalize();
	        Resource resource = new UrlResource(filePath.toUri());

	        if (resource.exists() && resource.isReadable()) {
	            return ResponseEntity.ok()
	                    .contentType(MediaType.parseMediaType(Files.probeContentType(filePath)))
	                    .body(resource);
	        } else {
	            throw new ResourceNotFoundException("Image not found");
	        }
	    } catch (IOException ex) {
	        throw new RuntimeException("Could not read the file!", ex);
	    }
	}


}
