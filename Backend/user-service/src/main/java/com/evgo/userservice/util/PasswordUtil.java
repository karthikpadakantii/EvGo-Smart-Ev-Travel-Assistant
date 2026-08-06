package com.evgo.userservice.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Passwords were previously stored and compared as plain text, which is a
 * serious security issue (a DB leak or log line exposes every user's real
 * password). This hashes with SHA-256 before persisting/comparing.
 *
 * Note: for a production system, a salted, slow hash (BCrypt/Argon2) via
 * spring-security-crypto is strongly preferred over a bare SHA-256 digest.
 * That was intentionally not introduced here since it requires adding a new
 * Maven dependency that could not be fetched/verified in this environment
 * (no network access). This is a minimal, dependency-free improvement over
 * plain text; swap it for BCryptPasswordEncoder when the project can pull
 * in spring-security-crypto.
 */
public final class PasswordUtil {

    private PasswordUtil() {
    }

    public static String hash(String rawPassword) {

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hashedBytes = digest.digest(
                    rawPassword.getBytes(StandardCharsets.UTF_8)
            );

            StringBuilder hexString = new StringBuilder();

            for (byte b : hashedBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }

            return hexString.toString();

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }

    public static boolean matches(String rawPassword, String hashedPassword) {
        return hash(rawPassword).equals(hashedPassword);
    }
}
