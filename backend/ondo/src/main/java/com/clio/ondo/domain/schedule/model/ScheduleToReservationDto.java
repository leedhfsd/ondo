package com.clio.ondo.domain.schedule.model;

import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class ScheduleToReservationDto {
    private Long sid;
    private String monday;
    private String tuesday;
    private String wednesday;
    private String thursday;
    private String friday;
    private Long cid;
}

