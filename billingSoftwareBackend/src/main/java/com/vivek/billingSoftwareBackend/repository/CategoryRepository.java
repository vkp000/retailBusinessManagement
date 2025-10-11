package com.vivek.billingSoftwareBackend.repository;

import com.vivek.billingSoftwareBackend.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {


     Optional<CategoryEntity> findByCategoryId(String categoryId) ;
}
