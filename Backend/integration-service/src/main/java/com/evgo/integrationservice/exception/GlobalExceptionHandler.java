package com.evgo.integrationservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpStatusCodeException;

import java.time.LocalDateTime;

/**
 * Without this, an unhandled exception here (e.g. OpenRouteService/
 * OpenChargeMap rejecting a request) fell through to Spring Boot's default
 * error page, which - with devtools active - includes the full stack trace
 * in the JSON body. That trace then got wrapped verbatim into a Feign
 * exception message on the journey-service side and shown to the user
 * as-is: a wall of Java internals instead of an actionable error.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UpstreamServiceException.class)
    public ResponseEntity<ErrorResponse> handleUpstream(UpstreamServiceException ex) {

        // 401/403 from a mapping/geocoding provider is essentially always a
        // key problem (missing, expired, revoked, or daily quota used up) -
        // never something the end user's request caused, so it's surfaced
        // as 502 Bad Gateway rather than passed through as-is.
        HttpStatus status =
                (ex.getUpstreamStatus() == 401 || ex.getUpstreamStatus() == 403)
                        ? HttpStatus.BAD_GATEWAY
                        : HttpStatus.SERVICE_UNAVAILABLE;

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                status.value(),
                "Upstream Service Error",
                ex.getMessage()
        );

        return new ResponseEntity<>(error, status);
    }

    @ExceptionHandler(HttpStatusCodeException.class)
    public ResponseEntity<ErrorResponse> handleHttpStatusCode(HttpStatusCodeException ex) {

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_GATEWAY.value(),
                "Upstream Service Error",
                "A mapping/charging provider request failed (" + ex.getStatusCode() + "). "
                        + "This usually means an API key is invalid, disabled, or has hit its "
                        + "daily quota - check the ORS / OpenChargeMap dashboard."
        );

        return new ResponseEntity<>(error, HttpStatus.BAD_GATEWAY);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                ex.getMessage()
        );

        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
