-- PostgreSQL Schema for Srushti Jewellery Database

-- Drop tables if they exist
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;

-- 1. Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- 2. Products Table
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    material VARCHAR(100) NOT NULL,
    weight VARCHAR(50),
    availability VARCHAR(50) DEFAULT 'In Stock',
    stock INT DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    is_new BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Orders Table
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    payment_status VARCHAR(100) NOT NULL,
    order_status VARCHAR(100) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    tax NUMERIC(12, 2) NOT NULL,
    delivery NUMERIC(12, 2) NOT NULL,
    total NUMERIC(12, 2) NOT NULL,
    utr VARCHAR(50),
    screenshot TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Order Items Table (Relationship: Order -> Items)
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    quantity INT NOT NULL,
    images TEXT[] DEFAULT '{}'
);

-- 5. Reviews Table
CREATE TABLE reviews (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Initial Categories
INSERT INTO categories (name) VALUES
('Necklace Sets'),
('Earrings'),
('Rings'),
('Bangles'),
('Bracelets'),
('Chains'),
('Bridal Collection'),
('Daily Wear Collection'),
('Festive Collection')
ON CONFLICT DO NOTHING;

-- Insert Initial Products (from mock data)
INSERT INTO products (id, name, description, price, category, material, weight, availability, stock, rating, reviews_count, images, features, is_new, is_bestseller) VALUES
('p1', 'Royal Peacock Gold Choker Set', 'An antique-finish 22K gold choker set featuring intricate peacock motifs, adorned with premium rubies, emeralds, and dangling South Sea pearls. Crafted by master artisans for a grand traditional look.', 185000, 'Necklace Sets', '22K Gold', '32.4g', 'In Stock', 8, 4.9, 24, 
 ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'],
 ARRAY['Handcrafted', 'Hallmarked 22K Gold', 'Free Insured Shipping', '10-day Return Policy'], true, true),

('p2', 'Starlight Solitaire Diamond Ring', 'A breathtaking 18K white gold band showcasing a brilliant-cut 1.0 carat solitaire diamond of VVS1 clarity and E color, flanked by micro-paved diamond accents.', 125000, 'Rings', 'Diamond & Platinum', '4.2g', 'In Stock', 12, 5.0, 42,
 ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'],
 ARRAY['IGI Certified Diamond', 'Platinum 950 Prong', 'Lifetime Exchange', 'Laser Engraved Serial Number'], true, true),

('p3', 'Classic Jhumka Drop Earrings', 'Charming traditional jhumkas in 22K yellow gold, detailing delicate filigree work, kundan embellishments, and tiny gold beads cascading gracefully.', 85000, 'Earrings', '22K Gold', '14.8g', 'In Stock', 15, 4.8, 18,
 ARRAY['https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop&q=80'],
 ARRAY['Comfort Hook', '100% BIS Hallmarked', 'Traditional Kundan Craft'], false, true),

('p4', 'Srushti Signature Kada Bangle', 'A broad, opulent bangle showing heavy embossing and floral engraving, finished in rich antique gold. Features a secure screw clasp for an adjustable fit.', 210000, 'Bangles', '22K Gold', '36.2g', 'In Stock', 4, 4.7, 11,
 ARRAY['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80'],
 ARRAY['Screw Closure', 'Antique Finish', 'Heavy Gold Filigree'], false, false),

('p5', 'Vasant Floral Gold Pendant', 'A delicate, nature-inspired gold pendant in a blooming floral silhouette, highlighted by shimmering diamond dewdrop details. Ideal for daily elegance.', 45000, 'Bridal Collection', '22K Gold', '6.5g', 'In Stock', 20, 4.9, 15,
 ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'],
 ARRAY['Lightweight', '22K BIS Hallmarked', 'Daily Wear Style'], true, false),

('p6', 'Royal Emerald Gold Choker', 'Exquisite chocker design studded with premium square-cut emeralds and rich diamonds, detailed with fine gold lace styling. An heirloom luxury piece.', 340000, 'Necklace Sets', '18K Gold & Diamonds', '42.5g', 'In Stock', 3, 5.0, 8,
 ARRAY['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&auto=format&fit=crop&q=80'],
 ARRAY['Certified Emeralds', 'VVS Diamond Accent', 'Custom Fitted Clasp'], false, true);
