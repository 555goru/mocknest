import { serial, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const Mocknest = pgTable('Mocknest', {
    id: serial('id').primaryKey(),
    jsonMockResp: varchar('jsonMockResp', 255).notNull(),
    jobPosition: varchar('jobPosition', 255).notNull(),
    jobDesc: varchar('jobDesc', 255).notNull(),
    jobExperience: varchar('jobExperience', 255).notNull(),
    createdBy: varchar('createdBy', 255).notNull(),
    createdAt: varchar('createdAt', 255),
    mockId: varchar('mockId', 255).notNull()


})