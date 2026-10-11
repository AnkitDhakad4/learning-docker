import mongoose from 'mongoose';
import dns from "dns"

dns.setServers(["8.8.8.8","8.8.4.4"])
/**
 * Connect to MongoDB strictly using the MONGO_URI defined in .env
 */
export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('Error: MONGO_URI is not defined in your .env file.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

