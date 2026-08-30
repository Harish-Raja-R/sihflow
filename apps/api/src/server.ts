import { createApp } from './app';
import { ENV } from './config/env';
import { connectDB } from './config/prisma';

async function bootstrap() {
  await connectDB();

  const app = createApp();

  app.listen(ENV.PORT, () => {
    console.log(`🚀 SihFlow ERP API Server running at http://localhost:${ENV.PORT}`);
    console.log(`📡 Versioned API Base: http://localhost:${ENV.PORT}/api/v1`);
    console.log(`🩺 Health Check: http://localhost:${ENV.PORT}/api/v1/health`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
