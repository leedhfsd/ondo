package com.clio.ondo.domain.career.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clio.ondo.domain.career.model.Career;

@Service
public interface CareerService {
	List<String> getCareer(long counselorId);
}
