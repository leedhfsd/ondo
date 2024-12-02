 package com.clio.ondo.global.config;

 import java.lang.reflect.Field;
 import java.sql.ResultSet;
 import java.sql.SQLException;
 import java.time.DayOfWeek;
 import java.time.LocalDate;
 import java.time.LocalDateTime;
 import java.time.LocalTime;
 import java.util.ArrayList;
 import java.util.Collections;
 import java.util.List;
 import java.util.stream.Stream;

 import javax.sql.DataSource;

 import com.clio.ondo.domain.counselor.service.CounselorService;
 import com.clio.ondo.domain.reservation.model.CounselorReservationAddDto;
 import com.clio.ondo.domain.reservation.repository.ReservationRepository;
 import com.clio.ondo.domain.reservation.service.CounselorReservationService;
 import com.clio.ondo.domain.schedule.model.ScheduleToReservationDto;
 import jakarta.persistence.EntityManagerFactory;
 import lombok.Data;
 import org.springframework.batch.core.Job;
 import org.springframework.batch.core.JobParameters;
 import org.springframework.batch.core.Step;
 import org.springframework.batch.core.configuration.support.DefaultBatchConfiguration;
 import org.springframework.batch.core.job.builder.JobBuilder;
 import org.springframework.batch.core.repository.JobRepository;
 import org.springframework.batch.core.step.builder.StepBuilder;
 import org.springframework.batch.item.ItemProcessor;
 import org.springframework.batch.item.database.*;
 import org.springframework.batch.item.database.builder.JpaPagingItemReaderBuilder;
 import org.springframework.batch.item.database.support.MySqlPagingQueryProvider;
 import org.springframework.beans.factory.annotation.Autowired;
 import org.springframework.boot.autoconfigure.batch.BatchProperties;
 import org.springframework.boot.context.properties.EnableConfigurationProperties;
 import org.springframework.context.annotation.Bean;
 import org.springframework.context.annotation.Configuration;
 import org.springframework.jdbc.core.RowMapper;
 import org.springframework.transaction.PlatformTransactionManager;

 import com.clio.ondo.domain.schedule.model.Schedule;

 @Configuration
 @EnableConfigurationProperties(BatchProperties.class)
 public class ReservationBatchConfig extends DefaultBatchConfiguration {
 	@Autowired
 	private DataSource dataSource;
	 @Autowired
	 private EntityManagerFactory entityManagerFactory;
	 @Autowired
	 private CounselorReservationService counselorReservationService;

 	private int chunk = 10;
 	// Job
 	@Bean
 	public Job reservationCreationJob(JobRepository jobRepository,
 		Step getCounselorSchedule) {
 		return new JobBuilder("reservationCreationJob", jobRepository)
 			.start(getCounselorSchedule)
 			.build();
 	}

 	// Job의 작은 작업 단위인 Step이다.
 	@Bean
 	public Step getCounselorSchedule(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
 		return new StepBuilder("getCounselorSchedule", jobRepository)
			.<ScheduleToReservationDto, List<CounselorReservationAddDto>>chunk(chunk, transactionManager)
 			.reader(jpaPagingItemReader(entityManagerFactory))
				.processor(reservationScheduleProcessor())
 			.writer(list -> {})
 			.build();
 	}

	 @Bean
	 public JpaPagingItemReader<ScheduleToReservationDto> jpaPagingItemReader(EntityManagerFactory entityManagerFactory) {
		 return new JpaPagingItemReaderBuilder<ScheduleToReservationDto>()
				 .name("scheduleReader")
				 .entityManagerFactory(entityManagerFactory)
				 .queryString("SELECT new com.clio.ondo.domain.schedule.model.ScheduleToReservationDto(s.id, s.monday, s.tuesday, s.wednesday, s.thursday, s.friday, c.id) " +
						 "FROM Counselor c JOIN c.schedule s ORDER BY s.id ASC")
				 .pageSize(1000)
				 .build();
	 }

 	@Bean
 	public ItemProcessor<ScheduleToReservationDto, List<CounselorReservationAddDto>> reservationScheduleProcessor() {
 		return schedule -> {
			List<CounselorReservationAddDto> reservations = new ArrayList<>();
			List<LocalDate> localDates = getLocalDates();

			for(LocalDate localDate : localDates) {
				DayOfWeek dayOfWeek = localDate.getDayOfWeek();

				// 주말은 생각하지 않는다.
				int dayOfWeekNumber = dayOfWeek.getValue();
				if(dayOfWeekNumber > 5) {
					continue;
				}

				// 요일을 소문자로 변환
				String dayOfWeekStr = dayOfWeek.toString().toLowerCase();

				// 문자열 토대로 가져오기
				Field field = schedule.getClass().getDeclaredField(dayOfWeekStr);
				field.setAccessible(true);
				String bits = (String) field.get(schedule);

				int startHour = 9;
				for(int i = 0; i < 9; i++){
					char hour = bits.charAt(i);

					if(hour == '1'){
						LocalTime time = LocalTime.of(startHour + i, 0, 0);

						LocalDateTime newDateTime = localDate.atTime(time);

						CounselorReservationAddDto reservation = CounselorReservationAddDto.builder()
							.reservationDate(newDateTime)
							.counselorId(schedule.getCid())
							.build();

						reservations.add(reservation);
					}
				}
			}

			for(CounselorReservationAddDto res : reservations){
				counselorReservationService.addReservation(res);
			}

			return reservations;
 		};
 	}

	 private List<LocalDate> getLocalDates() {
		 LocalDate today = LocalDate.now();
		 List<LocalDate> period = new ArrayList<>();

		 for(int i = 0; i < 14; i++){
			 LocalDate date = today.plusDays(i);
			 period.add(date);
		 }
		 return period;
	 }
 }
