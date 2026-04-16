package com.foodhub.model;

import com.foodhub.model.enums.OrderStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "order_number", unique = true, nullable = false, length = 20)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @NotNull(message = "Customer is required")
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    @NotNull(message = "Vendor is required")
    private VendorProfile vendor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rider_id")
    private User rider;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    // Pricing
    @Column(nullable = false, precision = 10, scale = 2)
    @DecimalMin(value = "0.0", message = "Subtotal must be positive")
    private BigDecimal subtotal;

    @Column(name = "delivery_fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal deliveryFee = BigDecimal.valueOf(5.00);

    @Column(nullable = false, precision = 10, scale = 2)
    @DecimalMin(value = "0.0", message = "Total must be positive")
    private BigDecimal total;

    // Delivery Details
    @Column(name = "delivery_address", nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;

    @Column(name = "delivery_latitude", nullable = false, precision = 10, scale = 8)
    @NotNull(message = "Delivery latitude is required")
    private BigDecimal deliveryLatitude;

    @Column(name = "delivery_longitude", nullable = false, precision = 11, scale = 8)
    @NotNull(message = "Delivery longitude is required")
    private BigDecimal deliveryLongitude;

    @Column(name = "delivery_notes", columnDefinition = "TEXT")
    private String deliveryNotes;

    @Column(name = "customer_phone", nullable = false, length = 15)
    @NotBlank(message = "Customer phone is required")
    private String customerPhone;

    // Timestamps
    @Column(name = "placed_at")
    @CreationTimestamp
    private LocalDateTime placedAt;

    @Column(name = "payment_initiated_at")
    private LocalDateTime paymentInitiatedAt;

    @Column(name = "payment_verified_at")
    private LocalDateTime paymentVerifiedAt;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @Column(name = "out_for_delivery_at")
    private LocalDateTime outForDeliveryAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    // Metadata
    @Column(name = "estimated_delivery_time")
    private Integer estimatedDeliveryTime; // minutes

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relationships
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    private OtpCode otpCode;

    // Helper methods
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }

    public boolean isPending() {
        return status == OrderStatus.PENDING;
    }

    public boolean isConfirmed() {
        return status == OrderStatus.CONFIRMED;
    }

    public boolean isOutForDelivery() {
        return status == OrderStatus.OUT_FOR_DELIVERY;
    }

    public boolean isDelivered() {
        return status == OrderStatus.DELIVERED;
    }

    public boolean isCancelled() {
        return status == OrderStatus.CANCELLED;
    }

    public boolean canBeModified() {
        return status == OrderStatus.PENDING || status == OrderStatus.CONFIRMED;
    }

    public String getMapsUrl() {
        return String.format("https://maps.google.com/?q=%s,%s", 
            deliveryLatitude, deliveryLongitude);
    }
}
