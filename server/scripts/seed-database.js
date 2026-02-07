require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');

async function createVendorAndProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expresskart');
    console.log('Connected to MongoDB');

    // Create a demo vendor
    const vendorData = {
      ownerUserId: new mongoose.Types.ObjectId(), // Temporary user ID
      businessName: "ExpressKart SuperMart",
      description: "Your one-stop shop for groceries, electronics, and daily essentials",
      businessType: "grocery",
      businessAddress: {
        street: "123 Main Street",
        city: "Bangalore",
        state: "Karnataka",
        zipCode: "560001",
        country: "India"
      },
      contactInfo: {
        phone: "+91-9876543210",
        email: "expresskart@supermart.com",
        website: "www.expresskart-supermart.com"
      },
      businessHours: [
        { day: 'monday', open: '08:00', close: '22:00', isOpen: true },
        { day: 'tuesday', open: '08:00', close: '22:00', isOpen: true },
        { day: 'wednesday', open: '08:00', close: '22:00', isOpen: true },
        { day: 'thursday', open: '08:00', close: '22:00', isOpen: true },
        { day: 'friday', open: '08:00', close: '22:00', isOpen: true },
        { day: 'saturday', open: '08:00', close: '23:00', isOpen: true },
        { day: 'sunday', open: '09:00', close: '21:00', isOpen: true }
      ],
      features: {
        hasDelivery: true,
        hasPickup: true,
        acceptsCash: true,
        acceptsCard: true,
        acceptsUPI: true,
        acceptsWallet: true
      },
      deliverySettings: {
        radius: 10,
        minOrderAmount: 100,
        deliveryFee: 20,
        estimatedDeliveryTime: 30
      },
      status: 'active',
      verificationStatus: {
        isVerified: true
      },
      images: {
        logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80",
        banner: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=1200&q=80"
      }
    };

    const vendor = await Vendor.create(vendorData);
    console.log(`Created vendor: ${vendor.businessName} (${vendor._id})`);

    // Product data for different categories
    const products = [
      // Grocery Items
      {
        title: "Premium Basmati Rice",
        description: "Long grain aromatic basmati rice, aged for 2 years for perfect taste and texture",
        shortDescription: "Aged premium basmati rice",
        category: "grocery",
        price: { mrp: 299, sellingPrice: 249 },
        inventory: { stock: 50, unit: "kg" },
        tags: ["rice", "basmati", "premium", "staple"]
      },
      {
        title: "Organic Turmeric Powder",
        description: "100% pure organic turmeric powder, rich in curcumin, perfect for cooking",
        shortDescription: "Pure organic turmeric powder",
        category: "grocery",
        price: { mrp: 149, sellingPrice: 119 },
        inventory: { stock: 100, unit: "gram" },
        tags: ["spice", "turmeric", "organic", "cooking"]
      },
      {
        title: "Extra Virgin Olive Oil",
        description: "Cold pressed extra virgin olive oil from Italy, perfect for salads and cooking",
        shortDescription: "Premium Italian olive oil",
        category: "grocery",
        price: { mrp: 899, sellingPrice: 749 },
        inventory: { stock: 30, unit: "liter" },
        tags: ["oil", "olive", "imported", "premium"]
      },
      {
        title: "Assorted Tea Collection",
        description: "Premium collection of 20 tea bags including green tea, black tea, and herbal infusions",
        shortDescription: "Premium tea collection",
        category: "beverages",
        price: { mrp: 399, sellingPrice: 299 },
        inventory: { stock: 75, unit: "pack" },
        tags: ["tea", "beverage", "collection", "premium"]
      },
      {
        title: "Fresh Whole Milk",
        description: "Farm-fresh whole milk, pasteurized and homogenized, rich in calcium",
        shortDescription: "Fresh farm milk",
        category: "dairy",
        price: { mrp: 60, sellingPrice: 55 },
        inventory: { stock: 200, unit: "liter" },
        tags: ["milk", "dairy", "fresh", "farm"]
      },
      {
        title: "Greek Yogurt",
        description: "Creamy Greek yogurt, high in protein, perfect for breakfast and snacks",
        shortDescription: "Creamy Greek yogurt",
        category: "dairy",
        price: { mrp: 89, sellingPrice: 79 },
        inventory: { stock: 60, unit: "gram" },
        tags: ["yogurt", "dairy", "greek", "protein"]
      },
      {
        title: "Artisan Sourdough Bread",
        description: "Handmade sourdough bread, slow fermented for 24 hours, crispy crust and soft interior",
        shortDescription: "Artisan sourdough bread",
        category: "bakery",
        price: { mrp: 120, sellingPrice: 99 },
        inventory: { stock: 40, unit: "piece" },
        tags: ["bread", "bakery", "artisan", "sourdough"]
      },
      {
        title: "Chocolate Croissants",
        description: "Buttery French croissants filled with premium Belgian chocolate",
        shortDescription: "Chocolate filled croissants",
        category: "bakery",
        price: { mrp: 180, sellingPrice: 149 },
        inventory: { stock: 25, unit: "piece" },
        tags: ["croissant", "bakery", "chocolate", "french"]
      },
      {
        title: "Fresh Red Apples",
        description: "Crisp and sweet red apples, perfect for snacking and cooking",
        shortDescription: "Fresh red apples",
        category: "produce",
        price: { mrp: 199, sellingPrice: 159 },
        inventory: { stock: 80, unit: "kg" },
        tags: ["fruits", "apples", "fresh", "produce"]
      },
      {
        title: "Organic Spinach",
        description: "Fresh organic spinach leaves, perfect for salads and cooking",
        shortDescription: "Fresh organic spinach",
        category: "produce",
        price: { mrp: 49, sellingPrice: 39 },
        inventory: { stock: 60, unit: "gram" },
        tags: ["vegetables", "spinach", "organic", "fresh"]
      },
      {
        title: "Free-Range Eggs",
        description: "Farm-fresh free-range eggs, rich in protein and nutrients",
        shortDescription: "Farm-fresh eggs",
        category: "dairy",
        price: { mrp: 150, sellingPrice: 129 },
        inventory: { stock: 100, unit: "dozen" },
        tags: ["eggs", "dairy", "farm", "protein"]
      },
      {
        title: "Premium Coffee Beans",
        description: "Arabica coffee beans from Colombia, medium roast with chocolate notes",
        shortDescription: "Colombian coffee beans",
        category: "beverages",
        price: { mrp: 599, sellingPrice: 499 },
        inventory: { stock: 45, unit: "gram" },
        tags: ["coffee", "beans", "arabica", "premium"]
      },
      {
        title: "Mineral Water Pack",
        description: "Pack of 12 mineral water bottles, purified and enriched with minerals",
        shortDescription: "Mineral water pack",
        category: "beverages",
        price: { mrp: 180, sellingPrice: 149 },
        inventory: { stock: 150, unit: "pack" },
        tags: ["water", "beverage", "mineral", "pack"]
      },
      {
        title: "Wireless Bluetooth Earbuds",
        description: "Premium wireless earbuds with noise cancellation and 24-hour battery life",
        shortDescription: "Wireless bluetooth earbuds",
        category: "electronics",
        price: { mrp: 2999, sellingPrice: 2499 },
        inventory: { stock: 30, unit: "piece" },
        tags: ["electronics", "earbuds", "bluetooth", "wireless"]
      },
      {
        title: "Smartphone Charging Cable",
        description: "Fast charging USB-C cable, 2 meters long, compatible with all devices",
        shortDescription: "Fast charging USB-C cable",
        category: "electronics",
        price: { mrp: 399, sellingPrice: 299 },
        inventory: { stock: 80, unit: "piece" },
        tags: ["electronics", "cable", "charging", "usb-c"]
      },
      {
        title: "Cotton T-Shirt",
        description: "100% organic cotton t-shirt, comfortable and breathable, available in multiple colors",
        shortDescription: "Organic cotton t-shirt",
        category: "clothing",
        price: { mrp: 599, sellingPrice: 449 },
        inventory: { stock: 120, unit: "piece" },
        tags: ["clothing", "t-shirt", "cotton", "organic"]
      },
      {
        title: "Denim Jeans",
        description: "Classic fit denim jeans with stretch, comfortable and durable",
        shortDescription: "Classic denim jeans",
        category: "clothing",
        price: { mrp: 1299, sellingPrice: 999 },
        inventory: { stock: 60, unit: "piece" },
        tags: ["clothing", "jeans", "denim", "classic"]
      },
      {
        title: "Running Shoes",
        description: "Comfortable running shoes with cushioned sole and breathable mesh upper",
        shortDescription: "Athletic running shoes",
        category: "footwear",
        price: { mrp: 2499, sellingPrice: 1999 },
        inventory: { stock: 40, unit: "piece" },
        tags: ["footwear", "shoes", "running", "athletic"]
      },
      {
        title: "Leather Wallet",
        description: "Genuine leather wallet with multiple card slots and RFID protection",
        shortDescription: "Genuine leather wallet",
        category: "other",
        price: { mrp: 899, sellingPrice: 699 },
        inventory: { stock: 50, unit: "piece" },
        tags: ["accessories", "wallet", "leather", "rfid"]
      },
      {
        title: "Face Moisturizer",
        description: "Hydrating face moisturizer with SPF 30, suitable for all skin types",
        shortDescription: "SPF 30 face moisturizer",
        category: "personal-care",
        price: { mrp: 499, sellingPrice: 399 },
        inventory: { stock: 70, unit: "piece" },
        tags: ["skincare", "moisturizer", "spf", "face"]
      },
      {
        title: "Shampoo & Conditioner Set",
        description: "Complete hair care set with natural ingredients, suitable for all hair types",
        shortDescription: "Natural shampoo conditioner set",
        category: "personal-care",
        price: { mrp: 699, sellingPrice: 549 },
        inventory: { stock: 55, unit: "pack" },
        tags: ["haircare", "shampoo", "conditioner", "natural"]
      },
      {
        title: "Hand Soap Dispenser",
        description: "Automatic hand soap dispenser, touchless operation, refillable",
        shortDescription: "Touchless soap dispenser",
        category: "household",
        price: { mrp: 799, sellingPrice: 649 },
        inventory: { stock: 35, unit: "piece" },
        tags: ["household", "soap", "dispenser", "automatic"]
      },
      {
        title: "Kitchen Knife Set",
        description: "Professional 6-piece stainless steel knife set with wooden block",
        shortDescription: "Professional knife set",
        category: "household",
        price: { mrp: 1999, sellingPrice: 1599 },
        inventory: { stock: 25, unit: "piece" },
        tags: ["kitchen", "knives", "stainless", "professional"]
      },
      {
        title: "Protein Powder",
        description: "Whey protein powder, 25g protein per serving, chocolate flavor",
        shortDescription: "Chocolate whey protein",
        category: "sports",
        price: { mrp: 2499, sellingPrice: 1999 },
        inventory: { stock: 40, unit: "gram" },
        tags: ["sports", "protein", "whey", "supplement"]
      },
      {
        title: "Yoga Mat",
        description: "Non-slip exercise yoga mat, 6mm thick, eco-friendly material",
        shortDescription: "Non-slip yoga mat",
        category: "sports",
        price: { mrp: 899, sellingPrice: 699 },
        inventory: { stock: 60, unit: "piece" },
        tags: ["sports", "yoga", "mat", "exercise"]
      },
      {
        title: "Baby Diapers Pack",
        description: "Pack of 50 soft and absorbent baby diapers, size M",
        shortDescription: "Baby diapers pack",
        category: "baby-products",
        price: { mrp: 599, sellingPrice: 449 },
        inventory: { stock: 80, unit: "pack" },
        tags: ["baby", "diapers", "soft", "absorbent"]
      },
      {
        title: "Baby Formula",
        description: "Nutritious baby formula for infants 0-6 months, iron fortified",
        shortDescription: "Infant baby formula",
        category: "baby-products",
        price: { mrp: 899, sellingPrice: 799 },
        inventory: { stock: 45, unit: "gram" },
        tags: ["baby", "formula", "infant", "nutrition"]
      },
      {
        title: "Pet Food Premium",
        description: "Premium dry pet food for adult dogs, chicken and rice formula",
        shortDescription: "Premium dog food",
        category: "pet-supplies",
        price: { mrp: 1299, sellingPrice: 1099 },
        inventory: { stock: 50, unit: "kg" },
        tags: ["pet", "dog", "food", "premium"]
      },
      {
        title: "Cat Litter",
        description: "Clumping cat litter, odor control, 10kg pack",
        shortDescription: "Clumping cat litter",
        category: "pet-supplies",
        price: { mrp: 699, sellingPrice: 549 },
        inventory: { stock: 40, unit: "kg" },
        tags: ["pet", "cat", "litter", "clumping"]
      },
      {
        title: "Garden Tools Set",
        description: "Complete garden tools set including spade, rake, and pruning shears",
        shortDescription: "Garden tools set",
        category: "garden",
        price: { mrp: 1599, sellingPrice: 1299 },
        inventory: { stock: 30, unit: "piece" },
        tags: ["garden", "tools", "outdoor", "plants"]
      },
      {
        title: "Flower Seeds Mix",
        description: "Mixed flower seeds for colorful garden blooms, easy to grow",
        shortDescription: "Flower seeds mix",
        category: "garden",
        price: { mrp: 199, sellingPrice: 149 },
        inventory: { stock: 100, unit: "pack" },
        tags: ["garden", "seeds", "flowers", "plants"]
      },
      {
        title: "Power Drill Set",
        description: "Cordless power drill with 20-piece bit set and carrying case",
        shortDescription: "Cordless power drill",
        category: "hardware",
        price: { mrp: 3999, sellingPrice: 3299 },
        inventory: { stock: 20, unit: "piece" },
        tags: ["hardware", "drill", "power", "tools"]
      },
      {
        title: "Paint Brush Set",
        description: "Professional paint brush set, 5 pieces, suitable for all paint types",
        shortDescription: "Professional paint brushes",
        category: "hardware",
        price: { mrp: 499, sellingPrice: 399 },
        inventory: { stock: 60, unit: "piece" },
        tags: ["hardware", "paint", "brushes", "professional"]
      },
      {
        title: "Fiction Novel Collection",
        description: "Best-selling fiction novels collection, 5 books set",
        shortDescription: "Fiction novels collection",
        category: "books",
        price: { mrp: 1499, sellingPrice: 1199 },
        inventory: { stock: 35, unit: "piece" },
        tags: ["books", "fiction", "novels", "collection"]
      },
      {
        title: "Cookbook for Beginners",
        description: "Easy-to-follow cookbook with 100+ recipes for beginners",
        shortDescription: "Beginner cookbook",
        category: "books",
        price: { mrp: 499, sellingPrice: 399 },
        inventory: { stock: 50, unit: "piece" },
        tags: ["books", "cookbook", "recipes", "beginners"]
      },
      {
        title: "Chocolate Gift Box",
        description: "Premium assorted chocolates gift box, 24 pieces",
        shortDescription: "Chocolate gift box",
        category: "gifts",
        price: { mrp: 899, sellingPrice: 699 },
        inventory: { stock: 40, unit: "piece" },
        tags: ["gifts", "chocolate", "premium", "assorted"]
      },
      {
        title: "Perfume Gift Set",
        description: "Luxury perfume gift set for men and women, 3 fragrances",
        shortDescription: "Luxury perfume set",
        category: "gifts",
        price: { mrp: 1999, sellingPrice: 1599 },
        inventory: { stock: 25, unit: "piece" },
        tags: ["gifts", "perfume", "luxury", "fragrance"]
      },
      {
        title: "Organic Honey",
        description: "Pure organic honey from Himalayan forests, 500g jar",
        shortDescription: "Organic Himalayan honey",
        category: "organic",
        price: { mrp: 299, sellingPrice: 249 },
        inventory: { stock: 70, unit: "gram" },
        tags: ["organic", "honey", "natural", "himalayan"]
      },
      {
        title: "Organic Quinoa",
        description: "Premium organic quinoa, high protein, gluten-free",
        shortDescription: "Organic quinoa",
        category: "organic",
        price: { mrp: 399, sellingPrice: 349 },
        inventory: { stock: 55, unit: "gram" },
        tags: ["organic", "quinoa", "protein", "gluten-free"]
      },
      {
        title: "Frozen Pizza",
        description: "Delicious frozen pizza with cheese and vegetables, ready to bake",
        shortDescription: "Frozen cheese pizza",
        category: "frozen-foods",
        price: { mrp: 199, sellingPrice: 149 },
        inventory: { stock: 80, unit: "piece" },
        tags: ["frozen", "pizza", "cheese", "ready-to-eat"]
      },
      {
        title: "Ice Cream Tub",
        description: "Premium vanilla ice cream, 1 liter tub, creamy and smooth",
        shortDescription: "Premium vanilla ice cream",
        category: "frozen-foods",
        price: { mrp: 299, sellingPrice: 249 },
        inventory: { stock: 60, unit: "liter" },
        tags: ["frozen", "ice-cream", "vanilla", "premium"]
      },
      {
        title: "Italian Pasta",
        description: "Authentic Italian pasta, durum wheat, various shapes pack",
        shortDescription: "Italian pasta pack",
        category: "imported-goods",
        price: { mrp: 249, sellingPrice: 199 },
        inventory: { stock: 90, unit: "pack" },
        tags: ["imported", "pasta", "italian", "durum"]
      },
      {
        title: "Swiss Chocolate",
        description: "Premium Swiss chocolate bar, milk chocolate with almonds",
        shortDescription: "Swiss milk chocolate",
        category: "imported-goods",
        price: { mrp: 399, sellingPrice: 349 },
        inventory: { stock: 65, unit: "piece" },
        tags: ["imported", "chocolate", "swiss", "premium"]
      },
      {
        title: "Multivitamin Tablets",
        description: "Complete multivitamin supplement, 60 tablets, for adults",
        shortDescription: "Adult multivitamin supplement",
        category: "pharmacy",
        price: { mrp: 599, sellingPrice: 449 },
        inventory: { stock: 80, unit: "piece" },
        tags: ["pharmacy", "vitamins", "supplements", "health"]
      },
      {
        title: "Pain Relief Balm",
        description: "Fast-acting pain relief balm for muscle aches and joint pain",
        shortDescription: "Pain relief balm",
        category: "pharmacy",
        price: { mrp: 149, sellingPrice: 119 },
        inventory: { stock: 100, unit: "piece" },
        tags: ["pharmacy", "pain", "relief", "balm"]
      },
      {
        title: "Home Decor Lamp",
        description: "Modern table lamp with adjustable brightness, LED bulb included",
        shortDescription: "Modern table lamp",
        category: "home-decor",
        price: { mrp: 1299, sellingPrice: 999 },
        inventory: { stock: 35, unit: "piece" },
        tags: ["decor", "lamp", "modern", "led"]
      },
      {
        title: "Wall Art Canvas",
        description: "Abstract wall art canvas, 24x36 inches, ready to hang",
        shortDescription: "Abstract wall art",
        category: "home-decor",
        price: { mrp: 1999, sellingPrice: 1599 },
        inventory: { stock: 25, unit: "piece" },
        tags: ["decor", "art", "canvas", "abstract"]
      },
      {
        title: "Silver Necklace",
        description: "Elegant sterling silver necklace with pendant, 925 silver",
        shortDescription: "Sterling silver necklace",
        category: "jewelry",
        price: { mrp: 2999, sellingPrice: 2499 },
        inventory: { stock: 20, unit: "piece" },
        tags: ["jewelry", "necklace", "silver", "sterling"]
      },
      {
        title: "Watch",
        description: "Analog watch with leather strap, water resistant",
        shortDescription: "Analog leather watch",
        category: "other",
        price: { mrp: 3999, sellingPrice: 3299 },
        inventory: { stock: 30, unit: "piece" },
        tags: ["accessories", "watch", "analog", "leather"]
      }
    ];

    // Image mapping for better product visuals
    const imageMap = {
      'Premium Basmati Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
      'Organic Turmeric Powder': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5',
      'Extra Virgin Olive Oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5',
      'Assorted Tea Collection': 'https://images.unsplash.com/photo-1594631252845-29fc4586c56c',
      'Fresh Whole Milk': 'https://images.unsplash.com/photo-1563636619-e9107da4a1bb',
      'Greek Yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
      'Artisan Sourdough Bread': 'https://images.unsplash.com/photo-1585478259715-876a6a81fc08',
      'Chocolate Croissants': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
      'Fresh Red Apples': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6',
      'Organic Spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb',
      'Free-Range Eggs': 'https://images.unsplash.com/photo-1506976785307-8732e854ad03',
      'Premium Coffee Beans': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e',
      'Mineral Water Pack': 'https://images.unsplash.com/photo-1548839140-29a749e1cf3d',
      'Wireless Bluetooth Earbuds': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df',
      'Smartphone Charging Cable': 'https://images.unsplash.com/photo-1541444196145-809f58337078',
      'Cotton T-Shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      'Denim Jeans': 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a',
      'Running Shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      'Leather Wallet': 'https://images.unsplash.com/photo-1627123424574-724758594e93',
      'Face Moisturizer': 'https://images.unsplash.com/photo-1620916566398-39f11438784e',
      'Shampoo & Conditioner Set': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d',
      'Hand Soap Dispenser': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a',
      'Kitchen Knife Set': 'https://images.unsplash.com/photo-1593618998160-e34014e67546',
      'Protein Powder': 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d',
      'Yoga Mat': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f',
      'Baby Diapers Pack': 'https://images.unsplash.com/photo-1544126592-807daa2b567b',
      'Baby Formula': 'https://images.unsplash.com/photo-1612017008860-226497b3737c',
      'Pet Food Premium': 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119',
      'Cat Litter': 'https://images.unsplash.com/photo-1574158622682-e40e69881006',
      'Garden Tools Set': 'https://images.unsplash.com/photo-1523301343968-6a6ebf63c672',
      'Flower Seeds Mix': 'https://images.unsplash.com/photo-1505235687559-28b5f54645b7',
      'Power Drill Set': 'https://images.unsplash.com/photo-1504148455328-497c5efdf13a',
      'Paint Brush Set': 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93',
      'Fiction Novel Collection': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d',
      'Cookbook for Beginners': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
      'Chocolate Gift Box': 'https://images.unsplash.com/photo-1549007994-cb92caefe51e',
      'Perfume Gift Set': 'https://images.unsplash.com/photo-1541643600914-78b084683601',
      'Organic Honey': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38',
      'Organic Quinoa': 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
      'Frozen Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
      'Ice Cream Tub': 'https://images.unsplash.com/photo-1501443762994-82bd5dabb89a',
      'Italian Pasta': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
      'Swiss Chocolate': 'https://images.unsplash.com/photo-1549007994-cb92caefe51e',
      'Multivitamin Tablets': 'https://images.unsplash.com/photo-1550572017-ed20bb0269f8',
      'Pain Relief Balm': 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6',
      'Home Decor Lamp': 'https://images.unsplash.com/photo-1507473885765-e6ed657dbbb7',
      'Wall Art Canvas': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
      'Silver Necklace': 'https://images.unsplash.com/photo-1599643477877-537ef5278533',
      'Watch': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314'
    };

    const categoryImages = {
      'grocery': 'https://images.unsplash.com/photo-1542838132-92c53300491e',
      'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661',
      'clothing': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f',
      'personal-care': 'https://images.unsplash.com/photo-1526947425960-945c6e72858f',
      'household': 'https://images.unsplash.com/photo-1583947215259-38e31be8751f',
      'beverages': 'https://images.unsplash.com/photo-1544145945-f904253d0c7b',
      'dairy': 'https://images.unsplash.com/photo-1550583724-1d552049521b',
      'bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
      'produce': 'https://images.unsplash.com/photo-1566385101042-1a000c126ec7',
      'sports': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
      'baby-products': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4',
      'pet-supplies': 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e',
      'garden': 'https://images.unsplash.com/photo-1416872834411-782e45261a7a',
      'hardware': 'https://images.unsplash.com/photo-1530124566582-a618bc2615ad',
      'books': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d',
      'jewelry': 'https://images.unsplash.com/photo-1515562141521-7a4cb0c5625b',
      'home-decor': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38',
      'other': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
    };

    // Create all products with real images
    const createdProducts = [];
    for (let i = 0; i < products.length; i++) {
      let imageUrl = imageMap[products[i].title] || categoryImages[products[i].category] || categoryImages['other'];

      const productData = {
        ...products[i],
        vendorId: vendor._id,
        images: [{
          url: `${imageUrl}?auto=format&fit=crop&w=800&q=80`,
          public_id: `product_${i + 1}`
        }],
        isActive: true,
        isFeatured: i < 10, // First 10 products as featured
        isBestSeller: i < 15, // First 15 products as best sellers
        isNewArrival: i >= 35, // Last products as new arrivals
        rating: {
          average: 4 + Math.random(), // Random rating between 4-5
          count: Math.floor(Math.random() * 100) + 10
        },
        seo: {
          slug: `${products[i].title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}-${i}`
        },
        sales: {
          totalSold: Math.floor(Math.random() * 100) + 1,
          revenue: Math.floor(Math.random() * 10000) + 100
        }
      };

      const product = await Product.create(productData);
      createdProducts.push(product._id);
      console.log(`Created product: ${product.title}`);
    }

    // Update vendor with product references
    vendor.products = createdProducts;
    await vendor.save();

    console.log(`\n✅ Created ${createdProducts.length} products for vendor: ${vendor.businessName}`);
    console.log(`📦 Total products in database: ${await Product.countDocuments()}`);
    console.log(`🏪 Total vendors: ${await Vendor.countDocuments()}`);

    mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error:', error);
    mongoose.disconnect();
  }
}

createVendorAndProducts();
