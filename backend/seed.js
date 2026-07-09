import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesToCopy = [
  'WhatsApp Image 2026-07-05 at 11.13.07 PM.jpeg',
  'WhatsApp Image 2026-07-05 at 11.13.21 PM.jpeg',
  'WhatsApp Image 2026-07-05 at 11.13.24 PM.jpeg',
  'WhatsApp Image 2026-07-05 at 11.13.25 PM.jpeg',
  'WhatsApp Image 2026-07-05 at 11.13.26 PM.jpeg',
  'WhatsApp Image 2026-07-05 at 11.13.26 PM (1).jpeg',
  'WhatsApp Image 2026-07-05 at 11.13.26 PM (2).jpeg',
  'WhatsApp Image 2026-07-05 at 11.13.27 PM.jpeg',
  'WhatsApp Image 2026-07-05 at 11.13.27 PM (1).jpeg',
  'WhatsApp Image 2026-07-05 at 11.24.20 PM.jpeg'
];

const seedProducts = [
  { name: 'Special Kadalai Mittai', price: 90, image: 'WhatsApp Image 2026-07-05 at 11.13.27 PM.jpeg' },
  { name: 'SMV Groundnut Balls', price: 120, image: 'WhatsApp Image 2026-07-05 at 11.13.27 PM (1).jpeg' },
  { name: 'Wholesale Groundnut Nice Chikki', price: 80, image: 'WhatsApp Image 2026-07-05 at 11.13.24 PM.jpeg' },
  { name: 'Golden Peanut Chikki (Jar Pack)', price: 100, image: 'WhatsApp Image 2026-07-05 at 11.13.07 PM.jpeg' },
  { name: 'Premium Jars Stack (Retail)', price: 150, image: 'WhatsApp Image 2026-07-05 at 11.13.21 PM.jpeg' },
  { name: 'Nice Groundnut Chikki Cakes', price: 110, image: 'WhatsApp Image 2026-07-05 at 11.13.26 PM.jpeg' },
  { name: 'Hanging Retail Packs', price: 95, image: 'WhatsApp Image 2026-07-05 at 11.24.20 PM.jpeg' },
  { name: 'SMV Peanut Candy (Pack of 30)', price: 180, image: 'WhatsApp Image 2026-07-05 at 11.13.26 PM (2).jpeg' }
];

async function main() {
  console.log('--- Database Seeding Script ---');

  // 1. Copy image files from frontend public folder to backend uploads folder
  const publicDir = path.join(__dirname, '..', 'web', 'public');
  const uploadsDir = path.join(__dirname, 'uploads');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created backend uploads folder');
  }

  console.log('Copying images...');
  for (const imgName of imagesToCopy) {
    const srcPath = path.join(publicDir, imgName);
    const destPath = path.join(uploadsDir, imgName);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${imgName}`);
    } else {
      console.warn(`Warning: source file not found at ${srcPath}`);
    }
  }

  // 2. Connect to MongoDB and seed products
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smv-kadalai-mittai';
  console.log(`Connecting to MongoDB at: ${mongoUri}`);
  
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // Clear existing products
    const deleteRes = await Product.deleteMany({});
    console.log(`Deleted ${deleteRes.deletedCount} existing products.`);

    // Insert new products
    const insertRes = await Product.insertMany(seedProducts);
    console.log(`Successfully seeded ${insertRes.length} products into the database.`);

  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

main();
