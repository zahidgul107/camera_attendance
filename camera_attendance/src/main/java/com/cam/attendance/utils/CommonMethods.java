package com.cam.attendance.utils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.web.multipart.MultipartFile;

public class CommonMethods {

	public static void uploadImage(MultipartFile imageName) {
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
