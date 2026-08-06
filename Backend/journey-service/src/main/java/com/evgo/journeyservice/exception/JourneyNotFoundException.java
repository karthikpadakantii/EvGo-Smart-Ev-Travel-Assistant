package com.evgo.journeyservice.exception;

public class JourneyNotFoundException extends RuntimeException {

    public JourneyNotFoundException(String message) {
        super(message);
    }
}