package com.vivek.billingSoftwareBackend.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BarcodeSyncRequest {

    private List<BarcodeMapping> mappings;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BarcodeMapping {
        private String barcode;
        private String productId;
        private boolean isReassignment;
    }
}