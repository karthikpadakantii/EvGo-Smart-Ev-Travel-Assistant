package com.evgo.userservice.service;

import com.evgo.userservice.dto.LoginRequest;
import com.evgo.userservice.dto.RegisterUserRequest;
import com.evgo.userservice.dto.UserResponse;
import com.evgo.userservice.entity.User;
import com.evgo.userservice.exception.InvalidCredentialsException;
import com.evgo.userservice.exception.UserAlreadyExistsException;
import com.evgo.userservice.exception.UserNotFoundException;
import com.evgo.userservice.repository.UserRepository;
import com.evgo.userservice.repository.VehicleRepository;
import com.evgo.userservice.service.impl.UserServiceImpl;
import com.evgo.userservice.util.PasswordUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void registerUser_Success() {
        RegisterUserRequest request = new RegisterUserRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail("john@example.com");
        request.setPassword("password123");
        request.setPhoneNumber("1234567890");

        User savedUser = new User();
        savedUser.setUserId(1L);
        savedUser.setFirstName("John");
        savedUser.setLastName("Doe");
        savedUser.setEmail("john@example.com");
        savedUser.setPhoneNumber("1234567890");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        try (MockedStatic<PasswordUtil> passwordUtilMock = mockStatic(PasswordUtil.class)) {
            passwordUtilMock.when(() -> PasswordUtil.hash("password123"))
                    .thenReturn("hashedpassword");

            UserResponse response = userService.registerUser(request);

            assertNotNull(response);
            assertEquals(1L, response.getUserId());
            assertEquals("John", response.getFirstName());
            assertEquals("Doe", response.getLastName());
            assertEquals("john@example.com", response.getEmail());
            assertEquals("1234567890", response.getPhoneNumber());

            verify(userRepository).existsByEmail("john@example.com");
            verify(userRepository).save(any(User.class));
        }
    }

    @Test
    void registerUser_DuplicateEmail_ThrowsException() {
        RegisterUserRequest request = new RegisterUserRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail("john@example.com");
        request.setPassword("password123");
        request.setPhoneNumber("1234567890");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class,
                () -> userService.registerUser(request));

        verify(userRepository).existsByEmail("john@example.com");
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_Success() {
        LoginRequest request = new LoginRequest();
        request.setEmail("john@example.com");
        request.setPassword("password123");

        User user = new User();
        user.setUserId(1L);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john@example.com");
        user.setPhoneNumber("1234567890");
        user.setPassword("hashedpassword");

        when(userRepository.findByEmail("john@example.com"))
                .thenReturn(Optional.of(user));

        try (MockedStatic<PasswordUtil> passwordUtilMock = mockStatic(PasswordUtil.class)) {
            passwordUtilMock.when(() -> PasswordUtil.matches("password123", "hashedpassword"))
                    .thenReturn(true);

            UserResponse response = userService.login(request);

            assertNotNull(response);
            assertEquals(1L, response.getUserId());
            assertEquals("John", response.getFirstName());
            assertEquals("Doe", response.getLastName());
            assertEquals("john@example.com", response.getEmail());

            verify(userRepository).findByEmail("john@example.com");
        }
    }

    @Test
    void login_WrongPassword_ThrowsException() {
        LoginRequest request = new LoginRequest();
        request.setEmail("john@example.com");
        request.setPassword("wrongpassword");

        User user = new User();
        user.setUserId(1L);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john@example.com");
        user.setPassword("hashedpassword");

        when(userRepository.findByEmail("john@example.com"))
                .thenReturn(Optional.of(user));

        try (MockedStatic<PasswordUtil> passwordUtilMock = mockStatic(PasswordUtil.class)) {
            passwordUtilMock.when(() -> PasswordUtil.matches("wrongpassword", "hashedpassword"))
                    .thenReturn(false);

            assertThrows(InvalidCredentialsException.class,
                    () -> userService.login(request));

            verify(userRepository).findByEmail("john@example.com");
        }
    }

    @Test
    void getUserById_Success() {
        User user = new User();
        user.setUserId(1L);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john@example.com");
        user.setPhoneNumber("1234567890");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserResponse response = userService.getUserById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getUserId());
        assertEquals("John", response.getFirstName());
        assertEquals("Doe", response.getLastName());
        assertEquals("john@example.com", response.getEmail());
        assertEquals("1234567890", response.getPhoneNumber());

        verify(userRepository).findById(1L);
    }
}
