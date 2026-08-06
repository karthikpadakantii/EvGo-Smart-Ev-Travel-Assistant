package com.evgo.journeyservice.exception;

import feign.FeignException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @ExceptionHandler(JourneyNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleJourneyNotFound(
            JourneyNotFoundException ex) {

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                ex.getMessage()
        );

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex) {

        String message = ex.getBindingResult()
                .getFieldError()
                .getDefaultMessage();

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Validation Error",
                message
        );

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Without this, a Feign call to integration-service (or any other
     * downstream) that comes back with a non-2xx status fell straight
     * through to the generic Exception handler below, which used
     * FeignException's own message - a dump of the HTTP method, URL, and
     * raw response body, not something a user should ever see. This
     * extracts the clean "message" field integration-service's own
     * GlobalExceptionHandler now puts in its error responses, and passes
     * the original status code through instead of always answering 500.
     */
    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ErrorResponse> handleFeignException(FeignException ex) {

        String message = extractMessage(ex);
        HttpStatus status = HttpStatus.resolve(ex.status());
        if (status == null) {
            status = HttpStatus.BAD_GATEWAY;
        }

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                status.value(),
                "Downstream Service Error",
                message
        );

        return new ResponseEntity<>(error, status);
    }

    private String extractMessage(FeignException ex) {

        String body = ex.contentUTF8();

        if (body != null && !body.isBlank()) {
            try {
                JsonNode json = OBJECT_MAPPER.readTree(body);
                JsonNode messageNode = json.get("message");
                if (messageNode != null && !messageNode.isNull()) {
                    return messageNode.asText();
                }
            } catch (Exception ignored) {
                // body wasn't the JSON error shape we expected - fall
                // through to a generic message below rather than leaking it
            }
        }

        return "A downstream service request failed (" + ex.status() + "). Please try again.";
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                ex.getMessage()
        );

        return new ResponseEntity<>(error,
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}