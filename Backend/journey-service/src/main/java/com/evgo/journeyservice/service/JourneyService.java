package com.evgo.journeyservice.service;

import com.evgo.journeyservice.dto.JourneyRequest;
import com.evgo.journeyservice.dto.JourneyResponse;

import java.util.List;

public interface JourneyService {

    JourneyResponse planJourney(JourneyRequest request);

    List<JourneyResponse> getJourneysByUser(Long userId);

    JourneyResponse getJourneyById(Long journeyId);

    void deleteJourney(Long journeyId);
}