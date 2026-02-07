const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');

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

async function updateImages() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log(`Updating ${products.length} products...`);

        let updatedCount = 0;
        for (const product of products) {
            let imageUrl = '';

            // Try exact title match
            if (imageMap[product.title]) {
                imageUrl = imageMap[product.title];
            }
            // Try case-insensitive title match
            else {
                const foundTitle = Object.keys(imageMap).find(t => t.toLowerCase() === product.title.toLowerCase());
                if (foundTitle) {
                    imageUrl = imageMap[foundTitle];
                } else {
                    // Use category image
                    imageUrl = categoryImages[product.category] || categoryImages['other'];
                }
            }

            // Add variety by adding unsplash params
            const finalUrl = `${imageUrl}?auto=format&fit=crop&w=800&q=80`;

            product.images = [{
                url: finalUrl,
                public_id: `upd_${product._id}`,
                uploadedAt: new Date()
            }];

            await product.save();
            updatedCount++;
            if (updatedCount % 10 === 0) console.log(`Updated ${updatedCount} products...`);
        }

        console.log(`Successfully updated ${updatedCount} products with real images.`);
        process.exit(0);
    } catch (error) {
        console.error('Error updating images:', error);
        process.exit(1);
    }
}

updateImages();
