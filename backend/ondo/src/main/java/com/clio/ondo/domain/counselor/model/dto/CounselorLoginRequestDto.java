package com.clio.ondo.domain.counselor.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CounselorLoginRequestDto {
    private String id;
    private String password;
}
