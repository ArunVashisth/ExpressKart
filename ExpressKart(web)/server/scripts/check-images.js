const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();
const Product = require('../models/Product');

async function checkImages() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({}, 'title images');
        console.log(`Checking ${products.length} products...`);

        let brokenCount = 0;

        // Check first 20 products
        for (let i = 0; i < 20; i++) {
            const product = products[i];
            if (product.images && product.images.length > 0) {
                const url = product.images[0].url;
                try {
                    await axios.head(url);
                    console.log(`✅ ${product.title}: OK`);
                } catch (err) {
                    console.log(`❌ ${product.title}: BROKEN (${url})`);
                    brokenCount++;
                }
            } else {
                console.log(`❌ ${product.title}: NO IMAGE`);
                brokenCount++;
            }
        }

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        mongoose.disconnect();
    }
}

checkImages();
