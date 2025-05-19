package org.example.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@ConfigurationProperties(prefix = "storage")
@Getter
@Setter
public class StorageProperties {
    private String location;

    public StorageProperties() {
        this.location = "uploads";
    }
}