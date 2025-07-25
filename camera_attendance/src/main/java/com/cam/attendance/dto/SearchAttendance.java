package com.cam.attendance.dto;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

public class SearchAttendance {
	
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private LocalDate fromDate;
	
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private LocalDate toDate;

	public LocalDate getFromDate() {
		return fromDate;
	}

	public void setFromDate(LocalDate fromDate) {
		this.fromDate = fromDate;
	}

	public LocalDate getToDate() {
		return toDate;
	}

	public void setToDate(LocalDate toDate) {
		this.toDate = toDate;
	}
	
	

}
