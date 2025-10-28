package com.smartshelf.smartshelf.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.smartshelf.smartshelf.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
