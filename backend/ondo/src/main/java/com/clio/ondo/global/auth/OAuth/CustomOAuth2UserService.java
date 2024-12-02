package com.clio.ondo.global.auth.OAuth;

import java.util.Map;
import java.util.Optional;

import com.clio.ondo.domain.character.model.Character;
import com.clio.ondo.domain.character.repository.CharacterRepository;
import com.clio.ondo.domain.character.service.CharacterService;
import com.clio.ondo.domain.mission.repository.MissionRepository;
import com.clio.ondo.domain.mission.service.MissionService;
import com.clio.ondo.global.auth.MemberPrincipalDetails;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clio.ondo.domain.character.model.Character;
import com.clio.ondo.domain.character.repository.CharacterRepository;
import com.clio.ondo.domain.member.model.Member;
import com.clio.ondo.domain.member.repository.MemberRepository;
import com.clio.ondo.domain.mission.service.MissionService;
import com.clio.ondo.global.auth.MemberPrincipalDetails;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final MemberRepository memberRepository;
    private final CharacterRepository characterRepository;
    private final MissionService missionService;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        Map<String, Object> oAuth2UserAttributes = super.loadUser(userRequest).getAttributes();
        log.info("userRequest: {}", userRequest);
        log.info("oAuth2UserAttributes: {}", oAuth2UserAttributes);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        OAuth2UserInfo oAuth2UserInfo =
                OAuth2UserInfo.of(registrationId, oAuth2UserAttributes);
        Member member = getOrSave(oAuth2UserInfo);
        return new MemberPrincipalDetails(member, oAuth2UserAttributes, userNameAttributeName);
    }

    @Transactional
    public Member getOrSave(OAuth2UserInfo userInfo) {
        Optional<Member> optionalMember = memberRepository.findByEmail(userInfo.getEmail());
        if (optionalMember.isEmpty()) {
            Member member = userInfo.toEntity();
            Character character = member.getCharacter();
            characterRepository.save(character);
            missionService.createTodayMission(member.getId());
            member.setDefaultPasswordIfNotSet();
            return memberRepository.save(member);
        } else {
            Member member = optionalMember.get();
            member.setDefaultPasswordIfNotSet();
            return memberRepository.save(member);
        }
    }

}