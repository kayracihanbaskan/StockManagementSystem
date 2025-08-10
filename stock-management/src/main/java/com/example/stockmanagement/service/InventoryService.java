package com.example.stockmanagement.service;

import com.example.stockmanagement.model.Inventory;
import com.example.stockmanagement.model.Product;
import com.example.stockmanagement.repository.InventoryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductService productService;

    @Autowired
    public InventoryService(InventoryRepository inventoryRepository, ProductService productService) {
        this.inventoryRepository = inventoryRepository;
        this.productService = productService;
    }

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public Inventory getInventoryById(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Inventory not found with id: " + id));
    }

    public Inventory getInventoryByProductId(Long productId) {
        Product product = productService.getProductById(productId);
        return inventoryRepository.findByProduct(product)
                .orElseThrow(() -> new EntityNotFoundException("Inventory not found for product id: " + productId));
    }

    public List<Inventory> getLowStockItems() {
        return inventoryRepository.findLowStockItems();
    }

    @Transactional
    public Inventory createInventory(Inventory inventory) {
        if (inventory.getProduct() != null && inventory.getProduct().getId() != null) {
            Product product = productService.getProductById(inventory.getProduct().getId());
            inventory.setProduct(product);
            
            // Check if inventory already exists for this product
            inventoryRepository.findByProduct(product).ifPresent(existingInventory -> {
                throw new IllegalStateException("Inventory already exists for product: " + product.getName());
            });
        }
        return inventoryRepository.save(inventory);
    }

    @Transactional
    public Inventory updateInventory(Long id, Inventory inventoryDetails) {
        Inventory inventory = getInventoryById(id);
        
        inventory.setQuantity(inventoryDetails.getQuantity());
        inventory.setMinStockLevel(inventoryDetails.getMinStockLevel());
        
        return inventoryRepository.save(inventory);
    }

    @Transactional
    public Inventory updateStock(Long productId, int quantity) {
        Product product = productService.getProductById(productId);
        Inventory inventory = inventoryRepository.findByProduct(product)
                .orElseThrow(() -> new EntityNotFoundException("Inventory not found for product id: " + productId));
        
        inventory.setQuantity(quantity);
        return inventoryRepository.save(inventory);
    }

    @Transactional
    public Inventory addStock(Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity to add must be positive");
        }
        
        Product product = productService.getProductById(productId);
        Inventory inventory = inventoryRepository.findByProduct(product)
                .orElseThrow(() -> new EntityNotFoundException("Inventory not found for product id: " + productId));
        
        inventory.setQuantity(inventory.getQuantity() + quantity);
        return inventoryRepository.save(inventory);
    }

    @Transactional
    public Inventory removeStock(Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity to remove must be positive");
        }
        
        Product product = productService.getProductById(productId);
        Inventory inventory = inventoryRepository.findByProduct(product)
                .orElseThrow(() -> new EntityNotFoundException("Inventory not found for product id: " + productId));
        
        if (inventory.getQuantity() < quantity) {
            throw new IllegalStateException("Not enough stock available");
        }
        
        inventory.setQuantity(inventory.getQuantity() - quantity);
        return inventoryRepository.save(inventory);
    }

    public void deleteInventory(Long id) {
        Inventory inventory = getInventoryById(id);
        inventoryRepository.delete(inventory);
    }
}
