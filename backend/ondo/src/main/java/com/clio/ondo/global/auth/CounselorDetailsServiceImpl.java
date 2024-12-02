package com.clio.ondo.global.auth;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.clio.ondo.domain.counselor.model.Counselor;
import com.clio.ondo.domain.counselor.repository.CounselorRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class CounselorDetailsServiceImpl implements UserDetailsService {
    private final CounselorRepository counselorRepository;

    @Override
    public UserDetails loadUserByUsername(String counselorId) throws UsernameNotFoundException {
        Counselor counselor = counselorRepository.findByCounselorId(counselorId)
                .orElseThrow(() -> new UsernameNotFoundException("Counselor not found"));
        return new CounselorPrincipalDetails(counselor);
    }
}
