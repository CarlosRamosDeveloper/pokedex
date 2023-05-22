export const AppConfig = () => ({
    environment: process.env.NODE_ENV  || "dev",
    mongodb: process.env.MONGODB,
    port: process.env.PORT || 24681,
    defaultLimit: process.env.DEFAULT_LIMIT || 10,
    defaultOffset: process.env.DEFAULT_OFFSET || 0
});