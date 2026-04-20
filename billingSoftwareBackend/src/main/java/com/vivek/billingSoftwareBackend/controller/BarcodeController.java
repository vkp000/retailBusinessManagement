package com.vivek.billingSoftwareBackend.controller;

import com.vivek.billingSoftwareBackend.entity.BarcodeEntity;
import com.vivek.billingSoftwareBackend.io.BarcodeSyncRequest;
import com.vivek.billingSoftwareBackend.repository.BarcodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/admin/barcodes")
@RequiredArgsConstructor
public class BarcodeController {

    private final BarcodeRepository barcodeRepository;

    /**
     * Batch sync: frontend sends all pending barcode mappings.
     * Backend handles:
     * - New barcode → create mapping
     * - Existing barcode → reassign to new product (remove old, create new)
     * - No duplicate barcodes guaranteed
     */
    @PostMapping("/sync")
    @ResponseStatus(HttpStatus.OK)
    public void syncBarcodes(@RequestBody BarcodeSyncRequest request) {
        for (BarcodeSyncRequest.BarcodeMapping mapping : request.getMappings()) {
            Optional<BarcodeEntity> existing = barcodeRepository.findByBarcode(mapping.getBarcode());

            if (existing.isPresent()) {
                // Reassign: update productId in-place
                BarcodeEntity entity = existing.get();
                entity.setProductId(mapping.getProductId());
                barcodeRepository.save(entity);
            } else {
                // New barcode: create fresh mapping
                BarcodeEntity newEntity = BarcodeEntity.builder()
                        .barcode(mapping.getBarcode())
                        .productId(mapping.getProductId())
                        .build();
                barcodeRepository.save(newEntity);
            }
        }
    }

    @GetMapping("/product/{productId}")
    public java.util.List<BarcodeEntity> getByProduct(@PathVariable String productId) {
        return barcodeRepository.findByProductId(productId);
    }

    @DeleteMapping("/{barcode}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBarcode(@PathVariable String barcode) {
        barcodeRepository.findByBarcode(barcode).ifPresent(barcodeRepository::delete);
    }
}