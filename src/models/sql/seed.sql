-- Database seed file for hair salon
-- This file creates tables and inserts all initial data

BEGIN;

-- Tables are created only if they do not already exist

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    service_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    duration INTEGER NOT NULL,
    image VARCHAR(250),
    slug VARCHAR(250) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create service_prices table
CREATE TABLE IF NOT EXISTS service_prices (
    id SERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL,
    hair_length VARCHAR(20) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id),
    UNIQUE (service_id, hair_length)
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL,
    account_status VARCHAR(20) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    stylist_id INTEGER,
    service_id INTEGER NOT NULL,
    appointment_date TIMESTAMP NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (stylist_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Create appointment_history table
CREATE TABLE IF NOT EXISTS appointment_history (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER NOT NULL,
    updated_by INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    review_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

    -- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert roles
INSERT INTO roles (id, code, name) VALUES
    (1, 'owner', 'Owner'),
    (2, 'stylist', 'Stylist'),
    (3, 'customer', 'Customer')
ON CONFLICT (id) DO NOTHING;

-- Insert services
INSERT INTO services (service_code, name, description, category, duration, image, slug) VALUES
    ('WOM-CUT', 'Women''s Haircut', 'Women''s haircut tailored to your style.', 'Cut', 45, './images/womens-layered-haircut-style.jpg', 'womens-haircut'),
    ('WOM-CURL', 'Women''s Curly Hair', 'Designed for curly and natural curly hair.', 'Curly', 120, './images/womens-natural-curly-hair-styling.jpg', 'womens-curly-hair'),
    ('MEN-CUT', 'Men''s Haircut', 'Clean and modern men''s haircut.', 'Cut', 30, './images/mens-modern-professional-haircut.jpg', 'mens-haircut'),
    ('MEN-CURL', 'Men''s Curly Hair', 'Men''s curly haircut tailored to your style and curl type.', 'Curly', 45, './images/mens-curly-hair-taper-fade.jpg', 'mens-curly-hair'),
    ('HAIR-COLOR', 'Hair Colour', 'Full hair coloring with professional products.', 'Color', 90, './images/full-hair-coloring-dye-service.jpg', 'hair-color'),
    ('BALAYAGE', 'Balayage', 'Natural-looking highlights with the balayage technique.', 'Color', 120, './images/blonde-balayage-highlights-service.jpg', 'balayage'),
    ('KERATIN', 'Keratin Treatment', 'Smooth and frizz-free hair with professional keratin treatment.', 'Treatment', 210, './images/hair-salon-ashburn-hero-welcome.jpg', 'keratin-treatment')
ON CONFLICT (service_code) DO NOTHING;

-- Insert service prices
INSERT INTO service_prices (service_id, hair_length, price) VALUES
    -- Women's Haircut
    (1, 'short', 45.00),
    (1, 'mid', 60.00),
    (1, 'long', 75.00),

    -- Women's Curly Hair
    (2, 'short', 65.00),
    (2, 'mid', 95.00),
    (2, 'long', 125.00),

    -- Men's Haircut
    (3, 'short', 25.00),
    (3, 'mid', 40.00),
    (3, 'long', 55.00),

    -- Men's Curly Hair
    (4, 'short', 65.00),
    (4, 'mid', 85.00),
    (4, 'long', 105.00),

    -- Hair Colour
    (5, 'short', 80.00),
    (5, 'mid', 95.00),
    (5, 'long', 110.00),

    -- Balayage
    (6, 'short', 150.00),
    (6, 'mid', 225.00),
    (6, 'long', 350.00),

    -- Keratin Treatment
    (7, 'short', 150.00),
    (7, 'mid', 170.00),
    (7, 'long', 190.00)
ON CONFLICT (service_id, hair_length) DO NOTHING;


COMMIT;