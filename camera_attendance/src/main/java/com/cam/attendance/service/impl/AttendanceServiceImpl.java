package com.cam.attendance.service.impl;

import java.security.Principal;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.cam.attendance.domain.Attendance;
import com.cam.attendance.domain.User;
import com.cam.attendance.dto.SearchAttendance;
import com.cam.attendance.repository.AttendanceRepository;
import com.cam.attendance.repository.UserRepository;
import com.cam.attendance.service.AttendanceService;
import com.cam.attendance.specification.AttendanceSpecification;

import jakarta.servlet.http.HttpSession;

@Service
public class AttendanceServiceImpl implements AttendanceService {

	@Autowired
	AttendanceRepository attendanceRepo;

	@Autowired
	UserRepository userRepo;

	@Override
	public Map<String, Object> getCount(Principal principal) {
		User user = userRepo.findByUsername(principal.getName()).get();
		List<Attendance> listAttendance = attendanceRepo.findByUser(user);
		Map<String, Object> response = new HashMap<>();
		response.put("attendanceCount", listAttendance.size());
		return response;
	}

	@Override
	public Page<Attendance> getPagAttendance(int page, HttpSession session, Principal principal) {
		SearchAttendance sessionSearch = (SearchAttendance) session.getAttribute("search");
		Page<Attendance> response = null;
		SearchAttendance search = null;
		if (sessionSearch != null) {
			search = sessionSearch;
			response = pagination(search, page, session, principal);
		} else {
			search = new SearchAttendance();
			response = pagination(search, page, session, principal);
		}
		Enumeration<String> attributeNames = session.getAttributeNames();
		while (attributeNames.hasMoreElements()) {
			String attributeName = attributeNames.nextElement();
			Object attributeValue = session.getAttribute(attributeName);
			System.err.println(attributeName + " : " + attributeValue);
		}
		return response;
	}

	private Page<Attendance> pagination(SearchAttendance search, int page, HttpSession session, Principal principal) {
		User user = userRepo.findByUsername(principal.getName()).get();

		Pageable pageable = PageRequest.of(page - 1, 10);

		Specification<Attendance> spec = Specification
				.where(AttendanceSpecification.withUser(user)
						.and(AttendanceSpecification.betweenAttendanceDate(search.getFromDate(), search.getToDate())));
		Page<Attendance> attendances = attendanceRepo.findAll(spec, pageable);
		return attendances;
	}

	@Override
	public Page<Attendance> search(SearchAttendance search, HttpSession session, Principal principal) {
		int page = 1;
		Page<Attendance> response = pagination(search, page, session, principal);
		return response;
	}

}
