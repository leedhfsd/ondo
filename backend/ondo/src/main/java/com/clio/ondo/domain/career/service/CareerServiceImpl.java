package com.clio.ondo.domain.career.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clio.ondo.domain.career.model.Career;
import com.clio.ondo.domain.career.repository.CareerRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CareerServiceImpl implements CareerService{

	@Autowired
	private CareerRepository careerRepository;

	@Override
	public List<String> getCareer(long counselorId){
		Optional<List<Career>> careers=careerRepository.findByCounselorId(counselorId);
		List<String> careerList=new ArrayList<>();
		if(careers.isPresent()){
			for(Career c:careers.get()){
				careerList.add(c.getCareer());
			}
		}

		return careerList;
	}

}
