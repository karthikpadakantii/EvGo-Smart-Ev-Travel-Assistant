package com.evgo.integrationservice.exception;

/**
 * Thrown when a call to an external provider (OpenRouteService,
 * OpenChargeMap) fails. Carries the upstream HTTP status so
 * GlobalExceptionHandler can react appropriately (e.g. 403/401 -> almost
 * always a bad/expired/quota-exhausted API key, not something the caller
 * did wrong).
 */
public class UpstreamServiceException extends RuntimeException {

    private final int upstreamStatus;

    public UpstreamServiceException(String message, int upstreamStatus) {
        super(message);
        this.upstreamStatus = upstreamStatus;
    }

    public int getUpstreamStatus() {
        return upstreamStatus;
    }
}
