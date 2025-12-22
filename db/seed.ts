import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { expense_categories } from './schema';

config({ path: '.env' });

const db = process.env.APP_ENV === 'production' ? drizzle(process.env.DATABASE_URL_PRODUCTION!) : drizzle(process.env.DATABASE_URL_DEVELOPMENT!);

async function seed() {
    try {
        console.log('Seeding categories...');

        const categories = [
            { name: 'Food' },
            { name: 'Transportation' },
            { name: 'Utilities' },
            { name: 'Entertainment' },
            { name: 'Clothes' },
            { name: 'Health' },
            { name: 'Education' },
            { name: 'Travel' },
            { name: 'Gifts' },
            { name: 'Other' }
        ];

        await db.insert(expense_categories).values(categories);

        console.log('Categories seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
}

seed();