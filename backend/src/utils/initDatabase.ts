import prisma from '../config/database';
import seedDatabase from './seedDatabase';

async function initDatabase() {
  try {
    console.log('🔧 Initializing database...');

    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection established');

    // Run database seeding
    console.log('🌱 Seeding database with default users...');
    await seedDatabase();

    console.log('🎉 Database initialization completed successfully!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        console.error('💡 Make sure MySQL server is running');
      } else if (error.message.includes('Access denied')) {
        console.error('💡 Check your database credentials in .env file');
      } else if (error.message.includes('Unknown database')) {
        console.error('💡 Create the database first: CREATE DATABASE financial_tracker;');
      }
    }
    
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run initialization if called directly
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('Database ready for use!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}

export default initDatabase; 