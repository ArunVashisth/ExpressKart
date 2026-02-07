require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function createTestUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expresskart');
    console.log('Connected to MongoDB');
    
    // Create test users
    const testUsers = [
      {
        name: 'Test User',
        email: 'user@test.com',
        password: 'password123',
        role: 'user',
        phone: '+1234567890',
        isEmailVerified: true
      },
      {
        name: 'Test Vendor',
        email: 'vendor@test.com', 
        password: 'password123',
        role: 'vendor',
        phone: '+1234567891',
        isEmailVerified: true
      },
      {
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'password123', 
        role: 'admin',
        phone: '+1234567892',
        isEmailVerified: true
      }
    ];
    
    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      
      console.log(`Created test user: ${user.email} (${user.role})`);
    }
    
    console.log('✅ Test users created successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('User: user@test.com / password123');
    console.log('Vendor: vendor@test.com / password123'); 
    console.log('Admin: admin@test.com / password123');
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    mongoose.disconnect();
  }
}

createTestUsers();
