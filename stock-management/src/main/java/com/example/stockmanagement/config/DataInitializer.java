package com.example.stockmanagement.config;

import com.example.stockmanagement.model.Category;
import com.example.stockmanagement.model.Inventory;
import com.example.stockmanagement.model.Product;
import com.example.stockmanagement.repository.CategoryRepository;
import com.example.stockmanagement.repository.InventoryRepository;
import com.example.stockmanagement.repository.ProductRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;

    public DataInitializer(
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            InventoryRepository inventoryRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @Override
    public void run(String... args) {
        // Check if data already exists to avoid duplicates
        if (categoryRepository.count() > 0) {
            System.out.println("Data already exists, skipping initialization");
            return;
        }

        System.out.println("Initializing sample data...");

        // Create categories
        Category electronics = new Category(null, "Electronics", "Electronic devices and accessories");
        Category clothing = new Category(null, "Clothing", "Apparel and fashion items");
        Category furniture = new Category(null, "Furniture", "Home and office furniture");

        categoryRepository.saveAll(Arrays.asList(electronics, clothing, furniture));
        System.out.println("Created 3 categories");

        // Create products
        Product laptop = new Product(null, "Laptop", "High-performance laptop", new BigDecimal("1200.00"), "ELEC-001",
                electronics);
        Product smartphone = new Product(null, "Smartphone", "Latest smartphone model", new BigDecimal("800.00"),
                "ELEC-002", electronics);
        Product tShirt = new Product(null, "T-Shirt", "Cotton t-shirt", new BigDecimal("25.00"), "CLTH-001", clothing);
        Product jeans = new Product(null, "Jeans", "Denim jeans", new BigDecimal("45.00"), "CLTH-002", clothing);
        Product desk = new Product(null, "Desk", "Office desk", new BigDecimal("150.00"), "FURN-001", furniture);
        Product chair = new Product(null, "Chair", "Office chair", new BigDecimal("120.00"), "FURN-002", furniture);

        productRepository.saveAll(Arrays.asList(laptop, smartphone, tShirt, jeans, desk, chair));
        System.out.println("Created 6 products");

        // Create inventory
        Inventory laptopInventory = new Inventory(null, laptop, 10, 5, null);
        Inventory smartphoneInventory = new Inventory(null, smartphone, 15, 5, null);
        Inventory tShirtInventory = new Inventory(null, tShirt, 50, 10, null);
        Inventory jeansInventory = new Inventory(null, jeans, 30, 10, null);
        Inventory deskInventory = new Inventory(null, desk, 5, 2, null);
        Inventory chairInventory = new Inventory(null, chair, 8, 3, null);

        inventoryRepository.saveAll(Arrays.asList(
                laptopInventory, smartphoneInventory, tShirtInventory,
                jeansInventory, deskInventory, chairInventory));
        System.out.println("Created 6 inventory records");
        System.out.println("Sample data initialization completed successfully!");
    }
}
