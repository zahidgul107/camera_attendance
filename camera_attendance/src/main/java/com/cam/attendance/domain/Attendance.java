package com.cam.attendance.domain;

import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Attendance {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@ManyToOne
	@JsonIgnore
    private User user;

	@DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime checkInTime;
	
	@DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime checkOutTime;
    
    @Column(name = "attendance_checkin_image")
    private String attendanceCheckInImageName;
    
    @Column(name = "attendance_checkout_image")
    private String attendanceCheckOutImageName;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public LocalDateTime getCheckInTime() {
		return checkInTime;
	}

	public void setCheckInTime(LocalDateTime checkInTime) {
		this.checkInTime = checkInTime;
	}

	public String getAttendanceCheckInImageName() {
		return attendanceCheckInImageName;
	}

	public void setAttendanceCheckInImageName(String attendanceCheckInImageName) {
		this.attendanceCheckInImageName = attendanceCheckInImageName;
	}

	public String getAttendanceCheckOutImageName() {
		return attendanceCheckOutImageName;
	}

	public void setAttendanceCheckOutImageName(String attendanceCheckOutImageName) {
		this.attendanceCheckOutImageName = attendanceCheckOutImageName;
	}

	public LocalDateTime getCheckOutTime() {
		return checkOutTime;
	}

	public void setCheckOutTime(LocalDateTime checkOutTime) {
		this.checkOutTime = checkOutTime;
	}
    
    

}
