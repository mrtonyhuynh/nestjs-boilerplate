import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { getConfig, getEnvironment } from "./common";
import { setup } from "./common/setup";

async function bootstrap() {
  try {
    const port = getConfig<number>('application.port', 3000);

    const app = await NestFactory.create(AppModule, {
      cors: getConfig<boolean>('application.cors', false),
      logger: getEnvironment() !== 'production',
    });
    // Init application
    await setup(app);
    await app.listen(port);
    console.info(`Server started on port ${port}`);
    console.info(`We are currently in ${getEnvironment()} mode.`);
  } catch (error) {
    console.error('Error starting server', error);
    process.exit();
  }
}

bootstrap().then(() => console.log('------\n'));
