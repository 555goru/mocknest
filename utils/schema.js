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

export const userAnswer = pgTable('UserAnswer',
    {
        id: serial('id').primaryKey(),
        mockidref: varchar('mockidref', 255).notNull(),
        question: varchar('question', 255).notNull(),
        correctanswer: varchar('correctanswer', 255),
        userans: varchar('userans', 255),
        feedback: varchar('feedback', 255),
        rating: varchar('rating', 255),
        userEmail: varchar('userEmail', 255),
        createdAt: varchar('createdAt', 255),
    }
)