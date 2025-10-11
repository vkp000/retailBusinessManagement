package com.vivek.billingSoftwareBackend.repository;

import com.vivek.billingSoftwareBackend.entity.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemEntityRepository extends JpaRepository<OrderItemEntity, Long> {

}
