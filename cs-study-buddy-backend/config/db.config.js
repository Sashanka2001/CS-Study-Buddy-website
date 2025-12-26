module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASSWORD || "root12",
  DB: process.env.DB_NAME || "study_buddy_db",
  dialect: process.env.DB_DIALECT || "mysql",
  // Optional full connection URL (Render or other providers may supply this)
  url: process.env.DATABASE_URL || null,
};
