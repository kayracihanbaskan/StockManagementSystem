package com.example.stockmanagement.controller;

import com.example.stockmanagement.model.Inventory;
import com.example.stockmanagement.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:5173")
public class InventoryController {

    private final InventoryService inventoryService;

    @Autowired
    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<Inventory>> getAllInventory() {
        List<Inventory> inventory = inventoryService.getAllInventory();
        return new ResponseEntity<>(inventory, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventory> getInventoryById(@PathVariable Long id) {
        Inventory inventory = inventoryService.getInventoryById(id);
        return new ResponseEntity<>(inventory, HttpStatus.OK);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<Inventory> getInventoryByProductId(@PathVariable Long productId) {
        Inventory inventory = inventoryService.getInventoryByProductId(productId);
        return new ResponseEntity<>(inventory, HttpStatus.OK);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Inventory>> getLowStockItems() {
        List<Inventory> lowStockItems = inventoryService.getLowStockItems();
        return new ResponseEntity<>(lowStockItems, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Inventory> createInventory(@Valid @RequestBody Inventory inventory) {
        Inventory newInventory = inventoryService.createInventory(inventory);
        return new ResponseEntity<>(newInventory, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inventory> updateInventory(@PathVariable Long id, @Valid @RequestBody Inventory inventory) {
        Inventory updatedInventory = inventoryService.updateInventory(id, inventory);
        return new ResponseEntity<>(updatedInventory, HttpStatus.OK);
    }

    @PutMapping("/product/{productId}")
    public ResponseEntity<Inventory> updateStock(
            @PathVariable Long productId,
            @RequestBody Map<String, Integer> request) {
        
        Integer quantity = request.get("quantity");
        if (quantity == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        Inventory updatedInventory = inventoryService.updateStock(productId, quantity);
        return new ResponseEntity<>(updatedInventory, HttpStatus.OK);
    }

    @PutMapping("/product/{productId}/add")
    public ResponseEntity<Inventory> addStock(
            @PathVariable Long productId,
            @RequestBody Map<String, Integer> request) {
        
        Integer quantity = request.get("quantity");
        if (quantity == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        Inventory updatedInventory = inventoryService.addStock(productId, quantity);
        return new ResponseEntity<>(updatedInventory, HttpStatus.OK);
    }

    @PutMapping("/product/{productId}/remove")
    public ResponseEntity<Inventory> removeStock(
            @PathVariable Long productId,
            @RequestBody Map<String, Integer> request) {
        
        Integer quantity = request.get("quantity");
        if (quantity == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        try {
            Inventory updatedInventory = inventoryService.removeStock(productId, quantity);
            return new ResponseEntity<>(updatedInventory, HttpStatus.OK);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long id) {
        inventoryService.deleteInventory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
