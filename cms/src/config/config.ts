export const config = {
  port: process.env.PORT ?? 4433,
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number.parseInt(process.env.DB_PORT ?? '5432', 10),
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    name: process.env.DB_NAME ?? 'cms',
  },
  kafka: {
    brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9093').split(','),
    clientId: process.env.KAFKA_CLIENT_ID ?? 'cms',
  },
} as const;
