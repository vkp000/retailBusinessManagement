package com.vivek.billingSoftwareBackend.service;

import com.vivek.billingSoftwareBackend.io.ItemRequest;
import com.vivek.billingSoftwareBackend.io.ItemResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ItemService {

    ItemResponse add(ItemRequest request, MultipartFile file);

    List<ItemResponse> fetchItems();

    void deleteItem(String itemId);
}
