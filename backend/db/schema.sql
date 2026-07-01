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
 ARRAY['Handcrafted', 'Hallmarked 22K Gold', 'Free Insured Shipping', '10-day Return Policy'], false, true),

('p2', 'Starlight Solitaire Diamond Ring', 'A breathtaking 18K white gold band showcasing a brilliant-cut 1.0 carat solitaire diamond of VVS1 clarity and E color, flanked by micro-paved diamond accents.', 125000, 'Rings', 'Diamond & Platinum', '4.2g', 'In Stock', 12, 5.0, 42,
 ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'],
 ARRAY['IGI Certified Diamond', 'Platinum 950 Prong', 'Lifetime Exchange', 'Laser Engraved Serial Number'], false, true),

('p3', 'Classic Jhumka Drop Earrings', 'Charming traditional jhumkas in 22K yellow gold, detailing delicate filigree work, kundan embellishments, and tiny gold beads cascading gracefully.', 85000, 'Earrings', '22K Gold', '14.8g', 'In Stock', 15, 4.8, 18,
 ARRAY['https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop&q=80'],
 ARRAY['Comfort Hook', '100% BIS Hallmarked', 'Traditional Kundan Craft'], false, true),

('p4', 'Srushti Signature Kada Bangle', 'A broad, opulent bangle showing heavy embossing and floral engraving, finished in rich antique gold. Features a secure screw clasp for an adjustable fit.', 210000, 'Bangles', '22K Gold', '36.2g', 'In Stock', 4, 4.7, 11,
 ARRAY['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80'],
 ARRAY['Screw Closure', 'Antique Finish', 'Heavy Gold Filigree'], false, true),

('p5', 'Aura Diamond Tennis Bracelet', 'Indulge in pure luxury with this elegant tennis bracelet crafted in 18K yellow gold, featuring a continuous loop of brilliant-cut diamonds totaling 4.5 carats.', 295000, 'Braceents', '18K Gold & Diamonds', '12.5g', 'In Stock', 3, 4.9, 29,
 ARRAY['https://images.unsplash.com/photo-1611085583191-a3b1a40ffd50?w=800&auto=format&fit=crop&q=80'],
 ARRAY['VVS-VS Diamonds', 'Double Security Clasp', 'Certificate of Authenticity'], true, false),

('p6', 'Sleek Gold Box-Chain Necklet', 'A versatile daily wear 18K yellow gold chain crafted with sturdy box links, offering a reflective finish that shines beautifully in any light.', 45000, 'Chains', '18K Gold', '7.5g', 'In Stock', 25, 4.6, 35,
 ARRAY['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop&q=80'],
 ARRAY['Daily Wear Durability', 'Lobster Lock', 'High Polish Finish'], true, false),

('p7', 'Maharani Bridal Kundan Haar', 'A monumental multi-layered bridal necklace fit for royalty. Decorated with hand-cut polki diamonds, custom enamel meenakari, and strings of freshwater pearls.', 485000, 'Bridal Collection', '22K Gold', '85.2g', 'In Stock', 2, 5.0, 9,
 ARRAY['https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'],
 ARRAY['Bridal Special Edition', 'Traditional Kundan & Meenakari', 'Signature Gift Box Included'], true, false),

('p8', 'Minimalist Diamond Studs', 'Chic and modern, these round-cut diamond studs set in 18K rose gold are perfect for daily wear, adding a touch of subtle sparkle to your wardrobe.', 35000, 'Daily Wear Collection', '18K Gold & Diamonds', '2.1g', 'In Stock', 30, 4.8, 57,
 ARRAY['https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop&q=80'],
 ARRAY['Daily Comfort Fit', 'Screw-back mechanism', 'VVS2 Clarity'], false, true),

('p9', 'Mayura Gold Jhumka Kundan Choker', 'A stunning festive collection piece celebrating the spirit of Indian festivals. Combines gold-plated brass detailing, hand-set Kundan stones, and elegant ruby droplets.', 115000, 'Festive Collection', '22K Gold', '20.5g', 'In Stock', 14, 4.7, 15,
 ARRAY['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&auto=format&fit=crop&q=80'],
 ARRAY['Festive Special', 'Comfort Fit Drawstring', 'BIS Hallmarked'], true, false),

('p10', 'Antique Temple Gold Necklace', 'Inspired by South Indian temple architecture, this 22K gold necklace features hand-engraved deity motifs, ruby cabochons, and dangling pearl drops for a regal look.', 225000, 'Necklace Sets', '22K Gold', '42.8g', 'In Stock', 6, 4.9, 31,
 ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'],
 ARRAY['Temple Craft Heritage', 'Ruby Cabochons', 'BIS Hallmarked 22K', 'Gift Box Included'], false, true),

('p11', 'Rose Gold Eternity Band', 'A modern 18K rose gold eternity band inlaid with channel-set round brilliant diamonds all around the shank — a perfect anniversary or engagement gift.', 78000, 'Rings', 'Rose Gold', '5.5g', 'In Stock', 18, 4.8, 44,
 ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80'],
 ARRAY['Channel-set Diamonds', 'Comfort Fit Band', 'IGI Certified', 'Lifetime Exchange'], true, false),

('p12', 'Pearl & Gold Chandelier Earrings', 'Graceful chandelier-style earrings suspending South Sea pearl drops in an elaborate 22K gold filigree frame, inspired by Mughal-era craftsmanship.', 62000, 'Earrings', '22K Gold', '10.2g', 'In Stock', 20, 4.7, 22,
 ARRAY['https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80'],
 ARRAY['South Sea Pearls', 'Mughal Filigree', 'Push-back Closure', 'BIS Hallmarked'], false, true),

('p13', 'Heritage Polki Diamond Haar', 'A spectacular bridal haar set with uncut polki diamonds, set in 22K yellow gold with emerald accents and intricate meenakari enamel detailing on the reverse.', 395000, 'Bridal Collection', '22K Gold', '68.5g', 'In Stock', 3, 5.0, 12,
 ARRAY['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?w=800&auto=format&fit=crop&q=80'],
 ARRAY['Uncut Polki Diamonds', 'Meenakari Reverse', 'Bridal Edition', 'Velvet Gift Box'], true, false),

('p14', 'Layered Gold Figaro Chain', 'A bold, statement layered Figaro chain in 22K yellow gold with alternating flat and round links — versatile enough for daily wear or festive occasions.', 58000, 'Chains', '22K Gold', '10.8g', 'In Stock', 22, 4.6, 38,
 ARRAY['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop&q=80'],
 ARRAY['Figaro Link Design', 'Lobster Clasp', '22K Hallmarked', 'Daily Wear Durability'], false, true),

('p15', 'Kundan Meenakari Bangle Set', 'A set of six ornate 22K gold bangles featuring Rajasthani Kundan stone setting and vivid meenakari enamel floral motifs — ideal for weddings and festivals.', 155000, 'Bangles', '22K Gold', '58.0g', 'In Stock', 9, 4.8, 17,
 ARRAY['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80'],
 ARRAY['Set of 6 Bangles', 'Kundan & Meenakari', 'BIS 916 Hallmarked', 'Traditional Rajasthani Craft'], true, false),

('p16', 'Diamond Cluster Cocktail Ring', 'An eye-catching cocktail ring in 18K gold featuring a central cushion-cut diamond surrounded by a halo of micro-paved diamonds — glamour personified.', 175000, 'Rings', '18K Gold & Diamonds', '8.2g', 'In Stock', 7, 4.9, 26,
 ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'],
 ARRAY['Cushion-cut Center Stone', 'Diamond Halo', 'IGI Certified', '18K Hallmarked'], false, true),

('p17', 'Gold Filigree Stud Earrings', 'Petite yet exquisite, these 22K gold filigree studs feature intricate wirework patterns forming blooming lotus flowers — timeless elegance for everyday wear.', 22000, 'Earrings', '22K Gold', '3.4g', 'In Stock', 35, 4.7, 51,
 ARRAY['https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop&q=80'],
 ARRAY['Lotus Filigree Design', 'Push-back Stud', 'Hypoallergenic Gold', 'BIS Hallmarked'], true, false),

('p18', 'Sapphire & Gold Statement Necklace', 'A bold statement necklace in 18K yellow gold, featuring a cascade of natural blue sapphires interspersed with round-cut diamonds for a vivid, luxurious contrast.', 310000, 'Necklace Sets', '18K Gold & Diamonds', '28.7g', 'In Stock', 5, 4.9, 19,
 ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'],
 ARRAY['Natural Blue Sapphires', 'Diamond Accents', 'IGI Certified', 'Free Insured Shipping'], false, true),

('p19', 'Aaranya Diamond Pendant', 'An exquisite rose gold diamond pendant in a blooming floral silhouette, highlighted by shimmering diamond dewdrop details. Ideal for layered elegance.', 65000, 'Necklace Sets', 'Rose Gold', '3.8g', 'In Stock', 15, 4.8, 14,
 ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'],
 ARRAY['18K Rose Gold', 'IGI Certified Diamond', 'Includes Matching Chain'], true, false),

('p20', 'Heritage Gold Mangalsutra', 'A traditional 22K gold mangalsutra featuring black bead stringing and a modern floral-engraved pendant set in a high-polished gold finish.', 145000, 'Necklace Sets', '22K Gold', '24.5g', 'In Stock', 8, 4.9, 22,
 ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'],
 ARRAY['Traditional Motif', 'Hallmarked 22K Gold', 'Handcrafted Stringing'], true, false);

