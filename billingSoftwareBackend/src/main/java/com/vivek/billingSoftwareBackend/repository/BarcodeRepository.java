package com.vivek.billingSoftwareBackend.repository;

import com.vivek.billingSoftwareBackend.entity.BarcodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BarcodeRepository extends JpaRepository<BarcodeEntity, Long> {
    Optional<BarcodeEntity> findByBarcode(String barcode);
    List<BarcodeEntity> findByProductId(String productId);
    void deleteByBarcode(String barcode);
}