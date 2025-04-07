import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./utils/schema.js",
    dbCredentials: {
        url: 'postgresql://accounts:npg_LNv4FRsSZP5l@ep-still-union-a55udnpx-pooler.us-east-2.aws.neon.tech/mocknest_data?sslmode=require'
    }
});
