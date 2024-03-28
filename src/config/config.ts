export default () => ({
    server: {
      port: process.env.PORT || 5000,
    },
    database: {
      connectionString: process.env.MONGODB_URL,
    },
  });