import {
    integer,
    text,
    pgTable,
    timestamp,
    varchar,
    boolean
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: integer("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password_hash: text("password_hash").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});