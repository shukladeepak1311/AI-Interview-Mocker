/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: "postgresql",
    dbCredentials: {
        url: 'postgresql://neondb_owner:7tyV2GWQcISj@ep-shiny-forest-a8car8gd.eastus2.azure.neon.tech/ai-interview-mocker?sslmode=require',
    }
};