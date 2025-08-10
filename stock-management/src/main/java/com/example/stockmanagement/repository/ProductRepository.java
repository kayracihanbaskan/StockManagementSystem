package com.example.stockmanagement.repository;

import com.example.stockmanagement.model.Category;
import com.example.stockmanagement.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(Category category);

    Optional<Product> findBySku(String sku); // Stock keeping unit
}
