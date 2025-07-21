package com.cam.attendance.utils;

import java.io.File;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.springframework.stereotype.Component;

@Component
public class FaceMatcher {
	
	public boolean compareFaces(File storedImage, File uploadedImage) {
	    try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
	        HttpPost request = new HttpPost("http://localhost:5000/compare");

	        MultipartEntityBuilder builder = MultipartEntityBuilder.create();
	        builder.addBinaryBody("uploaded", uploadedImage);
	        builder.addBinaryBody("stored", storedImage);

	        HttpEntity multipart = builder.build();
	        request.setEntity(multipart);

	        HttpResponse response = httpClient.execute(request);
	        String jsonResponse = EntityUtils.toString(response.getEntity());
	        JSONObject obj = new JSONObject(jsonResponse);

	        return obj.getBoolean("match");

	    } catch (Exception e) {
	        e.printStackTrace();
	        return false;
	    }
	}


}
