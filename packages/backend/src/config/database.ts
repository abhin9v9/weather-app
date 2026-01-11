import mongoose from 'mongoose';
import config from './config';

const connectDatabase = async (): Promise<void> => {
  try {
    const options: mongoose.ConnectOptions = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(config.mongodbUri, options);

    console.log(' MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error(' MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn(' MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log(' MongoDB reconnected successfully');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log(' MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        console.error(' Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error(' Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDatabase;
