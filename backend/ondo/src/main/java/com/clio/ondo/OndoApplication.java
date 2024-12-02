package com.clio.ondo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class OndoApplication {

	public static void main(String[] args) {
		SpringApplication.run(OndoApplication.class, args);
	}

}
