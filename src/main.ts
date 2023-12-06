import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './auth/auth.guard';
import { PrismaService } from './services/prisma.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(reflector));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  const config = new DocumentBuilder()
    .setTitle('Mondaa API')
    .setDescription('The Mondaa API description')
    .setVersion('1.0')
    .addTag('mondaa')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3030);
}
bootstrap();
