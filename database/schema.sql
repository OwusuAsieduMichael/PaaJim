-- FoodHub Database Schema
-- PostgreSQL 15+ / Supabase Compatible

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom Types
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'VENDOR', 'RIDER', 'ADMIN');
CREATE TYPE order_status AS ENUM ('PENDING', 'PAYMENT_INITIATED', 'PAYMENT_VERIFIED', 'CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'PAYMENT_FAILED');
CREATE TYPE notification_type AS ENUM ('ORDER_PLACED', 'PAYMENT_INITIATED', 'PAYMENT_VERIFIED', 'ORDER_CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role user_role NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    CONSTRAINT phone_format CHECK (phone_number ~ '^\+233[0-9]{9}$')
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- VENDOR PROFILE
-- ============================================
CREATE TABLE vendor_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(100) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    banner_url VARCHAR(500),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_open BOOLEAN DEFAULT true,
    opening_time TIME,
    closing_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_order ON categories(display_order);

-- ============================================
-- PRODUCTS (MENU ITEMS)
-- ============================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendor_profile(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT true,
    preparation_time INTEGER DEFAULT 15, -- minutes
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT price_positive CHECK (price > 0)
);

CREATE INDEX idx_products_vendor ON products(vendor_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_available ON products(is_available);

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    vendor_id UUID NOT NULL REFERENCES vendor_profile(id) ON DELETE RESTRICT,
    rider_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    status order_status DEFAULT 'PENDING',
    
    -- Pricing
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    delivery_fee DECIMAL(10, 2) DEFAULT 5.00 CHECK (delivery_fee >= 0),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    
    -- Delivery Details
    delivery_address TEXT NOT NULL,
    delivery_latitude DECIMAL(10, 8) NOT NULL,
    delivery_longitude DECIMAL(11, 8) NOT NULL,
    delivery_notes TEXT,
    customer_phone VARCHAR(15) NOT NULL,
    
    -- Timestamps
    placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    out_for_delivery_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    
    -- Metadata
    estimated_delivery_time INTEGER, -- minutes
    cancellation_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_vendor ON orders(vendor_id);
CREATE INDEX idx_orders_rider ON orders(rider_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_placed_at ON orders(placed_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);

-- ============================================
-- ORDER ITEMS
-- ============================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    
    product_name VARCHAR(100) NOT NULL, -- Snapshot at order time
    product_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    
    special_instructions TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ============================================
-- PAYMENTS
-- ============================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Payment details
    payment_reference VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'GHS',
    
    -- Payment method
    payment_method VARCHAR(50) NOT NULL, -- mobile_money, card
    provider VARCHAR(50), -- mtn, vodafone, airteltigo
    
    -- Status
    status VARCHAR(50) NOT NULL, -- pending, success, failed
    
    -- Paystack data
    paystack_transaction_id BIGINT,
    authorization_code VARCHAR(100),
    
    -- Timestamps
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    failed_at TIMESTAMP,
    
    -- Metadata
    failure_reason TEXT,
    metadata JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_reference ON payments(payment_reference);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================
-- PAYMENT OTP CODES
-- ============================================
CREATE TABLE payment_otp_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID UNIQUE NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    
    code VARCHAR(6) NOT NULL,
    
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP,
    
    attempts INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT payment_otp_code_format CHECK (code ~ '^[0-9]{6}$')
);

CREATE INDEX idx_payment_otp_payment ON payment_otp_codes(payment_id);
CREATE INDEX idx_payment_otp_code ON payment_otp_codes(code);

-- ============================================
-- OTP CODES (DELIVERY VERIFICATION)
-- ============================================
CREATE TABLE otp_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    code VARCHAR(6) NOT NULL,
    
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP,
    
    attempts INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT code_format CHECK (code ~ '^[0-9]{6}$')
);

CREATE INDEX idx_otp_order ON otp_codes(order_id);
CREATE INDEX idx_otp_code ON otp_codes(code);
CREATE INDEX idx_otp_expires ON otp_codes(expires_at);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    
    type notification_type NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    
    -- SMS tracking
    sms_sent BOOLEAN DEFAULT false,
    sms_sent_at TIMESTAMP,
    sms_status VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_order ON notifications(order_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================
-- RIDER AVAILABILITY
-- ============================================
CREATE TABLE rider_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rider_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_available BOOLEAN DEFAULT true,
    current_latitude DECIMAL(10, 8),
    current_longitude DECIMAL(11, 8),
    last_location_update TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rider_availability_status ON rider_availability(is_available);

-- ============================================
-- AUDIT LOG
-- ============================================
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    old_status order_status,
    new_status order_status,
    metadata JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_order ON audit_log(order_id);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_profile_updated_at BEFORE UPDATE ON vendor_profile
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rider_availability_updated_at BEFORE UPDATE ON rider_availability
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'ORD' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || 
                       LPAD(NEXTVAL('order_number_seq')::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_number_seq START 1;

CREATE TRIGGER set_order_number BEFORE INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default categories
INSERT INTO categories (name, display_order) VALUES
    ('Rice Dishes', 1),
    ('Soups & Stews', 2),
    ('Grilled & Fried', 3),
    ('Sides', 4),
    ('Drinks', 5);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Active orders with customer and rider info
CREATE VIEW active_orders_view AS
SELECT 
    o.id,
    o.order_number,
    o.status,
    o.total,
    o.delivery_address,
    o.placed_at,
    c.full_name AS customer_name,
    c.phone_number AS customer_phone,
    r.full_name AS rider_name,
    r.phone_number AS rider_phone,
    vp.business_name AS vendor_name
FROM orders o
JOIN users c ON o.customer_id = c.id
LEFT JOIN users r ON o.rider_id = r.id
JOIN vendor_profile vp ON o.vendor_id = vp.id
WHERE o.status IN ('PENDING', 'CONFIRMED', 'OUT_FOR_DELIVERY');

-- Order summary with items
CREATE VIEW order_summary_view AS
SELECT 
    o.id AS order_id,
    o.order_number,
    o.status,
    o.total,
    o.placed_at,
    json_agg(
        json_build_object(
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'price', oi.product_price,
            'subtotal', oi.subtotal
        )
    ) AS items
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.order_number, o.status, o.total, o.placed_at;

-- ============================================
-- SECURITY POLICIES (RLS)
-- ============================================

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Customers can only see their own orders
CREATE POLICY customer_orders_policy ON orders
    FOR SELECT
    USING (customer_id = current_setting('app.user_id')::UUID);

-- Riders can only see assigned orders
CREATE POLICY rider_orders_policy ON orders
    FOR SELECT
    USING (rider_id = current_setting('app.user_id')::UUID);

-- Users can only see their own notifications
CREATE POLICY user_notifications_policy ON notifications
    FOR SELECT
    USING (user_id = current_setting('app.user_id')::UUID);

-- ============================================
-- PERFORMANCE INDEXES
-- ============================================

-- Composite indexes for common queries
CREATE INDEX idx_orders_vendor_status ON orders(vendor_id, status);
CREATE INDEX idx_orders_rider_status ON orders(rider_id, status) WHERE rider_id IS NOT NULL;
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE orders IS 'Core orders table tracking the complete order lifecycle';
COMMENT ON TABLE otp_codes IS 'OTP verification codes for delivery confirmation';
COMMENT ON TABLE notifications IS 'In-app and SMS notifications for all users';
COMMENT ON COLUMN orders.order_number IS 'Human-readable order identifier (e.g., ORD202604150001)';
COMMENT ON COLUMN otp_codes.attempts IS 'Number of failed verification attempts (max 3). OTP expires after 60 minutes (1 hour)';
