package com.clio.ondo.domain.alarm.missionAlarm.service;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clio.ondo.domain.alarm.missionAlarm.model.FCMToken;

@Service
@EnableScheduling
public class ScheduledAlarmService {

	@Autowired
	@Qualifier("missionAlarmJob")
	Job missionAlarmJob;
	@Autowired
	JobLauncher jobLauncher;
	@Autowired
	private RedisTemplate redisTemplate;

	@Transactional
	public void saveToken(Long memberId, FCMToken fcmToken) throws Exception {
		String key = "memberId:" + Long.toString(memberId);

		List<String> tokens = redisTemplate.opsForList().range(key, 0, -1);
		for(String token : tokens) {
			if(token.equals(fcmToken.getFcmtoken())) {
				return;
			}
		}

		redisTemplate.opsForList().rightPush(key, fcmToken.getFcmtoken());
		// redis 만료기간 1시간
		redisTemplate.expire(key, 3600, TimeUnit.SECONDS);
	}

	@Transactional
	public void deleteToken(Long memberId, FCMToken fcmToken) throws Exception {
		if(fcmToken.getFcmtoken().isEmpty() || fcmToken.getFcmtoken() == null || fcmToken.getFcmtoken() == "") {
			return;
		}
		String key = "memberId:" + Long.toString(memberId);

		Long removedCount = redisTemplate.opsForList().remove(key, 1, fcmToken.getFcmtoken());
	}

	@Scheduled(cron = "0 28 1 * * *")
	//@Scheduled(fixedDelay = 10800000)
	public void createSpecialMission(){
		try{
			JobParameters jobParameters = new JobParametersBuilder()
				.addLong("time", System.currentTimeMillis())
				.toJobParameters();

			jobLauncher.run(missionAlarmJob, jobParameters);
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}

//	 애플리케이션 시작 시 한 번만 실행되는 메서드 (테스트 시에 사용)
//     @EventListener(ApplicationReadyEvent.class)
//     public void runOnceAtStartup() {
//         // 실제 작업 호출
// 	 	createSpecialMission();
//     }
}
