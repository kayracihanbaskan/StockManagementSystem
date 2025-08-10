package com.example.stockmanagement.controller;

import com.example.stockmanagement.service.DataCleanupService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "http://localhost:5173")
public class DataController {

    private final DataCleanupService dataCleanupService;

    public DataController(DataCleanupService dataCleanupService) {
        this.dataCleanupService = dataCleanupService;
    }

    @DeleteMapping("/cleanup/all")
    public ResponseEntity<String> cleanupAllData() {
        try {
            dataCleanupService.cleanupAllData();
            return new ResponseEntity<>("All data cleaned up successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to cleanup data: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/cleanup/seeded")
    public ResponseEntity<String> cleanupSeededData() {
        try {
            dataCleanupService.cleanupSeededData();
            return new ResponseEntity<>("Seeded data cleaned up successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to cleanup seeded data: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
