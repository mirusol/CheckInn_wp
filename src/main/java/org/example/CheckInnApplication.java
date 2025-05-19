package org.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.example.config.StorageProperties;

@SpringBootApplication
@EnableConfigurationProperties(StorageProperties.class)
public class CheckInnApplication {

    public static void main(String[] args) {
        SpringApplication.run(CheckInnApplication.class, args);
    }
}