import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { BusinessType, UserRole } from '@prisma/client';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Get default user credentials from environment variables
    const defaultUsers = [
      {
        username: process.env.COSMETIC_ADMIN_USERNAME! ,
        password: process.env.COSMETIC_ADMIN_PASSWORD! ,
        businessType: BusinessType.COSMETIC,
        role: UserRole.ADMIN
      },
      {
        username: process.env.COSMETIC_USER_USERNAME! ,
        password: process.env.COSMETIC_USER_PASSWORD!,
        businessType: BusinessType.COSMETIC,
        role: UserRole.USER
      },
      {
        username: process.env.CLOTHING_ADMIN_USERNAME!,
        password: process.env.CLOTHING_ADMIN_PASSWORD!,
        businessType: BusinessType.CLOTHING,
        role: UserRole.ADMIN
      },
      {
        username: process.env.CLOTHING_USER_USERNAME!,
        password: process.env.CLOTHING_USER_PASSWORD!,
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
    console.log(`  Admin: ${process.env.COSMETIC_ADMIN_USERNAME || 'cosmetic_admin'} / ${process.env.COSMETIC_ADMIN_PASSWORD ? '***' : 'cosmetic123'}`);
    console.log(`  User:  ${process.env.COSMETIC_USER_USERNAME || 'cosmetic'} / ${process.env.COSMETIC_USER_PASSWORD ? '***' : 'sagarrahul'}`);
    console.log('\nCLOTHING BUSINESS:');
    console.log(`  Admin: ${process.env.CLOTHING_ADMIN_USERNAME || 'clothing_admin'} / ${process.env.CLOTHING_ADMIN_PASSWORD ? '***' : 'clothing123'}`);
    console.log(`  User:  ${process.env.CLOTHING_USER_USERNAME || 'kapada'} / ${process.env.CLOTHING_USER_PASSWORD ? '***' : 'sagarrahul'}`);
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