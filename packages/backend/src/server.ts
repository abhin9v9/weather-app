import createApp from './app';
import { config, connectDatabase } from './config';

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Start listening
    const server = app.listen(config.port, () => {
      console.log(`
🚀 Weather Dashboard API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Environment: ${config.nodeEnv}
🔗 URL: http://localhost:${config.port}
📚 API: http://localhost:${config.port}/api
💚 Health: http://localhost:${config.port}/api/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('❌ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: Error) => {
      console.error('❌ Unhandled Rejection:', reason);
      // Close server & exit process
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      console.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
