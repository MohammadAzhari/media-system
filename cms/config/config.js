const baseConfig = {
  dialect: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number.parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'cms',
  logging: false,
};

module.exports = {
  development: baseConfig,
  test: baseConfig,
  production: baseConfig,
};
