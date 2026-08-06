package com.evgo.journeyservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class JourneyServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(JourneyServiceApplication.class, args);
    }

}