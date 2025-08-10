package com.example.stockmanagement.service;

import com.example.stockmanagement.repository.CategoryRepository;
import com.example.stockmanagement.repository.InventoryRepository;
import com.example.stockmanagement.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DataCleanupService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public DataCleanupService(
            InventoryRepository inventoryRepository,
            ProductRepository productRepository,
            CategoryRepository categoryRepository) {
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public void cleanupAllData() {
        System.out.println("Starting data cleanup...");
        
        // Delete in proper order to avoid foreign key constraints
        long inventoryCount = inventoryRepository.count();
        inventoryRepository.deleteAll();
        System.out.println("Deleted " + inventoryCount + " inventory records");
        
        long productCount = productRepository.count();
        productRepository.deleteAll();
        System.out.println("Deleted " + productCount + " products");
        
        long categoryCount = categoryRepository.count();
        categoryRepository.deleteAll();
        System.out.println("Deleted " + categoryCount + " categories");
        
        System.out.println("Data cleanup completed successfully!");
    }

    @Transactional
    public void cleanupSeededData() {
        System.out.println("Starting seeded data cleanup...");
        
        // Delete specific seeded data by SKU patterns or names
        // This is safer than deleting all data
        
        // Delete inventory for seeded products
        productRepository.findBySku("ELEC-001").ifPresent(product -> {
            inventoryRepository.findByProduct(product).ifPresent(inventory -> {
                inventoryRepository.delete(inventory);
                System.out.println("Deleted inventory for: " + product.getName());
            });
        });
        
        productRepository.findBySku("ELEC-002").ifPresent(product -> {
            inventoryRepository.findByProduct(product).ifPresent(inventory -> {
                inventoryRepository.delete(inventory);
                System.out.println("Deleted inventory for: " + product.getName());
            });
        });
        
        productRepository.findBySku("CLTH-001").ifPresent(product -> {
            inventoryRepository.findByProduct(product).ifPresent(inventory -> {
                inventoryRepository.delete(inventory);
                System.out.println("Deleted inventory for: " + product.getName());
            });
        });
        
        productRepository.findBySku("CLTH-002").ifPresent(product -> {
            inventoryRepository.findByProduct(product).ifPresent(inventory -> {
                inventoryRepository.delete(inventory);
                System.out.println("Deleted inventory for: " + product.getName());
            });
        });
        
        productRepository.findBySku("FURN-001").ifPresent(product -> {
            inventoryRepository.findByProduct(product).ifPresent(inventory -> {
                inventoryRepository.delete(inventory);
                System.out.println("Deleted inventory for: " + product.getName());
            });
        });
        
        productRepository.findBySku("FURN-002").ifPresent(product -> {
            inventoryRepository.findByProduct(product).ifPresent(inventory -> {
                inventoryRepository.delete(inventory);
                System.out.println("Deleted inventory for: " + product.getName());
            });
        });
        
        // Delete seeded products
        productRepository.findBySku("ELEC-001").ifPresent(product -> {
            productRepository.delete(product);
            System.out.println("Deleted product: " + product.getName());
        });
        
        productRepository.findBySku("ELEC-002").ifPresent(product -> {
            productRepository.delete(product);
            System.out.println("Deleted product: " + product.getName());
        });
        
        productRepository.findBySku("CLTH-001").ifPresent(product -> {
            productRepository.delete(product);
            System.out.println("Deleted product: " + product.getName());
        });
        
        productRepository.findBySku("CLTH-002").ifPresent(product -> {
            productRepository.delete(product);
            System.out.println("Deleted product: " + product.getName());
        });
        
        productRepository.findBySku("FURN-001").ifPresent(product -> {
            productRepository.delete(product);
            System.out.println("Deleted product: " + product.getName());
        });
        
        productRepository.findBySku("FURN-002").ifPresent(product -> {
            productRepository.delete(product);
            System.out.println("Deleted product: " + product.getName());
        });
        
        // Delete seeded categories
        categoryRepository.findByName("Electronics").ifPresent(category -> {
            categoryRepository.delete(category);
            System.out.println("Deleted category: " + category.getName());
        });
        
        categoryRepository.findByName("Clothing").ifPresent(category -> {
            categoryRepository.delete(category);
            System.out.println("Deleted category: " + category.getName());
        });
        
        categoryRepository.findByName("Furniture").ifPresent(category -> {
            categoryRepository.delete(category);
            System.out.println("Deleted category: " + category.getName());
        });
        
        System.out.println("Seeded data cleanup completed successfully!");
    }
}
