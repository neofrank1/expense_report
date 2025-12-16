'use server';

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
    const user = await currentUser();
    if (!user) {
        throw new Error("User not found");
    }
    
    try {
        // Check if user exists
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.clerk_id, user.id))
            .limit(1);
        
        // If user doesn't exist, insert them
        if (existingUser.length === 0) {
            await db.insert(users).values({
                clerk_id: user.id,
                email: user.emailAddresses[0]?.emailAddress || '',
                full_name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
            });
        }
    } catch (error: any) {
        // Handle race condition where user might be created by another request
        if (!error?.message?.includes('unique') && !error?.code?.includes('23505')) {
            console.error("Error syncing user:", error);
            throw error;
        }
    }
}