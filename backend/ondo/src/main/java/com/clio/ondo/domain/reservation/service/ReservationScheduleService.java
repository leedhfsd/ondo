package com.clio.ondo.domain.reservation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class ReservationScheduleService {
    @Qualifier("reservationCreationJob")
    private final Job reservationCreationJob;

    private final JobLauncher jobLauncher;

    private LocalDateTime lastRun = LocalDateTime.MIN;

    @Scheduled(cron = "0 0 21 * * SUN")
    public void setReservationBySchedule(){
        try{
            LocalDateTime now = LocalDateTime.now();
            if (ChronoUnit.WEEKS.between(lastRun, now) >= 2) {
                JobParametersBuilder builder = new JobParametersBuilder()
                        .addLong("time", System.currentTimeMillis());

                JobParameters jobParameters = builder.toJobParameters();
                jobLauncher.run(reservationCreationJob, jobParameters);

                lastRun = now;
            }
        }
        catch(Exception e){
            e.printStackTrace();
        }
    }

    // 애플리케이션 시작 시 한 번만 실행되는 메서드 (테스트 시에 사용)
//    @EventListener(ApplicationReadyEvent.class)
//    public void runOnceAtStartup() {
//        // 실제 작업 호출
//        setReservationBySchedule();
//    }
}
