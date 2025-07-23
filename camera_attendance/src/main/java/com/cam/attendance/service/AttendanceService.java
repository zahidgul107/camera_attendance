package com.cam.attendance.service;

import java.security.Principal;
import java.util.Map;

public interface AttendanceService {

	Map<String, Object> getCount(Principal principal);

}
