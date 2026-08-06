package com.evgo.journeyservice.controller;

import com.evgo.journeyservice.dto.JourneyRequest;
import com.evgo.journeyservice.dto.JourneyResponse;
import com.evgo.journeyservice.service.JourneyService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/journeys")
public class JourneyController {

    private final JourneyService journeyService;

    public JourneyController(JourneyService journeyService) {
        this.journeyService = journeyService;
    }


    @PostMapping("/plan")
    public ResponseEntity<JourneyResponse> planJourney(
            @Valid @RequestBody JourneyRequest request) {

        return ResponseEntity.ok(
                journeyService.planJourney(request)
        );
    }


    @GetMapping("/{journeyId}")
    public ResponseEntity<JourneyResponse> getJourneyById(
            @PathVariable Long journeyId) {

        return ResponseEntity.ok(
                journeyService.getJourneyById(journeyId)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<java.util.List<JourneyResponse>> getJourneysByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                journeyService.getJourneysByUser(userId)
        );
    }

    @DeleteMapping("/{journeyId}")
    public ResponseEntity<Void> deleteJourney(
            @PathVariable Long journeyId) {

        journeyService.deleteJourney(journeyId);

        return ResponseEntity.noContent().build();
    }
}