package com.foodhub.model;

import com.foodhub.model.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "phone_number", unique = true, nullable = false, length = 15)
    @Pattern(regexp = "^\\+233[0-9]{9}$", message = "Phone number must be in format +233XXXXXXXXX")
    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @Column(name = "full_name", nullable = false, length = 100)
    @NotBlank(message = "Full name is required")
    private String fullName;

    @Column(unique = true, length = 100)
    @Email(message = "Invalid email format")
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Helper methods
    public boolean isCustomer() {
        return role == UserRole.CUSTOMER;
    }

    public boolean isVendor() {
        return role == UserRole.VENDOR;
    }

    public boolean isRider() {
        return role == UserRole.RIDER;
    }

    public boolean isAdmin() {
        return role == UserRole.ADMIN;
    }
}
