import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./utils/schema.js",
    dbCredentials: {
        url: 'postgresql://neondb_owner:npg_HDW8qiVObQv7@ep-winter-wave-a5cjr54m-pooler.us-east-2.aws.neon.tech/mocknest_data?sslmode=require'
    }
});
