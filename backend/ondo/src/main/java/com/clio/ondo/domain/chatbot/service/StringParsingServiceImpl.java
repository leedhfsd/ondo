package com.clio.ondo.domain.chatbot.service;

import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import org.springframework.stereotype.Service;

@Service
public class StringParsingServiceImpl implements StringParsingService {
	@Override
	public List<String> parseLine(String line) {
		List<String> list = new ArrayList<String>();
		String[] tokens = line.split("(?<=[\n?!.])");

		for (String token : tokens) {
			list.add(token.trim());
		}

		return list;
	}
}
