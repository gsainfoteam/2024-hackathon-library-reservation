import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // set swagger config
  const config = new DocumentBuilder()
    .setTitle('library reservation API')
    .setDescription('library reservation API')
    .setVersion('1.0')
    .addTag('library reservation')
    .addOAuth2(
      {
        type: 'oauth2',
        scheme: 'bearer',
        in: 'header',
        bearerFormat: 'token',
        flows: {
          authorizationCode: {
            authorizationUrl: configService.getOrThrow('SWAGGER_AUTH_URL'),
            tokenUrl: configService.getOrThrow('SWAGGER_TOKEN_URL'),
            scopes: {
              openid: 'openid',
              email: 'email',
              profile: ' profile',
            },
          },
        },
      },
      'oauth2',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      oauth2RedirectUrl: `${configService.getOrThrow('API_URL')}/api/oauth2-redirect.html`,
    },
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
