// Premium Mock Products Data with detailed specifications and styling parameters
export const CATEGORIES = [
  "Necklace Sets",
  "Earrings",
  "Rings",
  "Bangles",
  "Bracelets",
  "Chains",
  "Bridal Collection",
  "Daily Wear Collection",
  "Festive Collection"
];

export const MATERIALS = ["22K Gold", "18K Gold", "Diamond & Platinum", "Rose Gold", "18K Gold & Diamonds"];

export const INITIAL_PRODUCTS = [
  {
    id: "p1",
    name: "Royal Peacock Gold Choker Set",
    description: "An antique-finish 22K gold choker set featuring intricate peacock motifs, adorned with premium rubies, emeralds, and dangling South Sea pearls. Crafted by master artisans for a grand traditional look.",
    price: 185000,
    category: "Necklace Sets",
    material: "22K Gold",
    weight: "32.4g",
    availability: "In Stock",
    stock: 8,
    rating: 4.9,
    reviewsCount: 24,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80"
    ],
    features: ["Handcrafted", "Hallmarked 22K Gold", "Free Insured Shipping", "10-day Return Policy"],
    isNew: true,
    isBestSeller: true
  },
  {
    id: "p2",
    name: "Starlight Solitaire Diamond Ring",
    description: "A breathtaking 18K white gold band showcasing a brilliant-cut 1.0 carat solitaire diamond of VVS1 clarity and E color, flanked by micro-paved diamond accents.",
    price: 125000,
    category: "Rings",
    material: "Diamond & Platinum",
    weight: "4.2g",
    availability: "In Stock",
    stock: 12,
    rating: 5.0,
    reviewsCount: 42,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80"
    ],
    features: ["IGI Certified Diamond", "Platinum 950 Prong", "Lifetime Exchange", "Laser Engraved Serial Number"],
    isNew: true,
    isBestSeller: true
  },
  {
    id: "p3",
    name: "Classic Jhumka Drop Earrings",
    description: "Charming traditional jhumkas in 22K yellow gold, detailing delicate filigree work, kundan embellishments, and tiny gold beads cascading gracefully.",
    price: 85000,
    category: "Earrings",
    material: "22K Gold",
    weight: "14.8g",
    availability: "In Stock",
    stock: 15,
    rating: 4.8,
    reviewsCount: 18,
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop&q=80"
    ],
    features: ["Comfort Hook", "100% BIS Hallmarked", "Traditional Kundan Craft"],
    isNew: false,
    isBestSeller: true
  },
  {
    id: "p4",
    name: "Srushti Signature Kada Bangle",
    description: "A broad, opulent bangle showing heavy embossing and floral engraving, finished in rich antique gold. Features a secure screw clasp for an adjustable fit.",
    price: 210000,
    category: "Bangles",
    material: "22K Gold",
    weight: "36.2g",
    availability: "In Stock",
    stock: 4, // low stock alert!
    rating: 4.7,
    reviewsCount: 11,
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80"
    ],
    features: ["Screw Closure", "Antique Finish", "Heavy Gold Filigree"],
    isNew: false,
    isBestSeller: false
  },
  {
    id: "p5",
    name: "Aura Diamond Tennis Bracelet",
    description: "Indulge in pure luxury with this elegant tennis bracelet crafted in 18K yellow gold, featuring a continuous loop of brilliant-cut diamonds totaling 4.5 carats.",
    price: 295000,
    category: "Bracelets",
    material: "18K Gold & Diamonds",
    weight: "12.5g",
    availability: "In Stock",
    stock: 3, // low stock alert!
    rating: 4.9,
    reviewsCount: 29,
    images: [
      "https://images.unsplash.com/photo-1611085583191-a3b1a40ffd50?w=800&auto=format&fit=crop&q=80"
    ],
    features: ["VVS-VS Diamonds", "Double Security Clasp", "Certificate of Authenticity"],
    isNew: true,
    isBestSeller: false
  },
  {
    id: "p6",
    name: "Sleek Gold Box-Chain Necklet",
    description: "A versatile daily wear 18K yellow gold chain crafted with sturdy box links, offering a reflective finish that shines beautifully in any light.",
    price: 45000,
    category: "Chains",
    material: "18K Gold",
    weight: "7.5g",
    availability: "In Stock",
    stock: 25,
    rating: 4.6,
    reviewsCount: 35,
    images: [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop&q=80"
    ],
    features: ["Daily Wear Durability", "Lobster Lock", "High Polish Finish"],
    isNew: false,
    isBestSeller: false
  },
  {
    id: "p7",
    name: "Maharani Bridal Kundan Haar",
    description: "A monumental multi-layered bridal necklace fit for royalty. Decorated with hand-cut polki diamonds, custom enamel meenakari, and strings of freshwater pearls.",
    price: 485000,
    category: "Bridal Collection",
    material: "22K Gold",
    weight: "85.2g",
    availability: "In Stock",
    stock: 2, // low stock!
    rating: 5.0,
    reviewsCount: 9,
    images: [
      "https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80"
    ],
    features: ["Bridal Special Edition", "Traditional Kundan & Meenakari", "Signature Gift Box Included"],
    isNew: true,
    isBestSeller: true
  },
  {
    id: "p8",
    name: "Minimalist Diamond Studs",
    description: "Chic and modern, these round-cut diamond studs set in 18K rose gold are perfect for daily wear, adding a touch of subtle sparkle to your wardrobe.",
    price: 35000,
    category: "Daily Wear Collection",
    material: "18K Gold & Diamonds",
    weight: "2.1g",
    availability: "In Stock",
    stock: 30,
    rating: 4.8,
    reviewsCount: 57,
    images: [
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop&q=80"
    ],
    features: ["Daily Comfort Fit", "Screw-back mechanism", "VVS2 Clarity"],
    isNew: false,
    isBestSeller: true
  },
  {
    id: "p9",
    name: "Mayura Gold Jhumka Kundan Choker",
    description: "A stunning festive collection piece celebrating the spirit of Indian festivals. Combines gold-plated brass detailing, hand-set Kundan stones, and elegant ruby droplets.",
    price: 115000,
    category: "Festive Collection",
    material: "22K Gold",
    weight: "20.5g",
    availability: "In Stock",
    stock: 14,
    rating: 4.7,
    reviewsCount: 15,
    images: [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&auto=format&fit=crop&q=80"
    ],
    features: ["Festive Special", "Comfort Fit Drawstring", "BIS Hallmarked"],
    isNew: true,
    isBestSeller: false
  }
];

export const INITIAL_REVIEWS = [
  {
    id: "r1",
    userName: "Ananya Sharma",
    rating: 5,
    comment: "Absolutely in love with the Royal Peacock Choker set! The craftsmanship is spectacular. The gold weight is exactly as certified, and the packaging was extremely luxurious.",
    date: "2026-05-15",
    productName: "Royal Peacock Gold Choker Set"
  },
  {
    id: "r2",
    userName: "Rajesh Patel",
    rating: 5,
    comment: "Bought the Starlight Solitaire Ring for my wife. The diamond certificate from IGI was provided. Outstanding service, fast delivery, and very trustworthy brand.",
    date: "2026-06-02",
    productName: "Starlight Solitaire Diamond Ring"
  },
  {
    id: "r3",
    userName: "Meera Krishnan",
    rating: 4,
    comment: "The Jhumkas are extremely pretty and elegant. A bit heavy for long wear, but the shine and polish are breathtaking. Received many compliments at the wedding!",
    date: "2026-06-18",
    productName: "Classic Jhumka Drop Earrings"
  }
];

export const INSTAGRAM_IMAGES = [
  { id: "insta1", url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80", caption: "Timeless Bridal Splendor #SrushtiBridal" },
  { id: "insta2", url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80", caption: "Glimmer in Diamonds #SrushtiSolitaires" },
  { id: "insta3", url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80", caption: "Everyday luxury redefine #DailySrushti" },
  { id: "insta4", url: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80", caption: "Traditional Handcrafted Kada #AntiqueHeritage" },
  { id: "insta5", url: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&auto=format&fit=crop&q=80", caption: "Festive Sparkle #SrushtiFestivals" },
  { id: "insta6", url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80", caption: "Exquisite details that capture hearts #SrushtiJewels" }
];
