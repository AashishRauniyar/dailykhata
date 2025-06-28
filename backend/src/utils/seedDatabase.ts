import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { BusinessType, UserRole } from '@prisma/client';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create default users for both businesses
    const defaultUsers = [
      {
        username: 'cosmetic_admin',
        password: 'cosmetic123',
        businessType: BusinessType.COSMETIC,
        role: UserRole.ADMIN
      },
      {
        username: 'cosmetic_user',
        password: 'cosmetic123',
        businessType: BusinessType.COSMETIC,
        role: UserRole.USER
      },
      {
        username: 'clothing_admin',
        password: 'clothing123',
        businessType: BusinessType.CLOTHING,
        role: UserRole.ADMIN
      },
      {
        username: 'clothing_user',
        password: 'clothing123',
        businessType: BusinessType.CLOTHING,
        role: UserRole.USER
      }
    ];

    for (const userData of defaultUsers) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { username: userData.username }
      });

      if (!existingUser) {
        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        // Create user
        await prisma.user.create({
          data: {
            username: userData.username,
            password: hashedPassword,
            businessType: userData.businessType,
            role: userData.role
          }
        });

        console.log(`✅ Created user: ${userData.username} (${userData.businessType} - ${userData.role})`);
      } else {
        console.log(`ℹ️  User already exists: ${userData.username}`);
      }
    }

    console.log('🎉 Database seeding completed!');
    console.log('\n📋 Default Login Credentials:');
    console.log('═'.repeat(50));
    console.log('COSMETIC BUSINESS:');
    console.log('  Admin: cosmetic_admin / cosmetic123');
    console.log('  User:  cosmetic_user / cosmetic123');
    console.log('\nCLOTHING BUSINESS:');
    console.log('  Admin: clothing_admin / clothing123');
    console.log('  User:  clothing_user / clothing123');
    console.log('═'.repeat(50));

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Database seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase; 