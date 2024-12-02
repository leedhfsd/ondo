package com.clio.ondo.domain.member.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateRequestDto {
    private String password;
    private String nickname;
}
