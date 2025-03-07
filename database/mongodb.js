import mongoose from "mongoose";
import { MONGODB_URI, NODE_ENV} from '../config/env.js';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside the .env<development/production>.local');
}

const connectDataBase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`API Database running on ${NODE_ENV} mode`)
  } catch (err) {
    console.error('Error connecting to database: ', "[", err, "]" );
    process.exit(1);
  }
}

export default connectDataBase;