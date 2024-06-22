import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

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
              profile: 'profile',
              student_id: 'student_id',
            },
          },
        },
      },
      'oauth2',
    )
    .build();
  // set CORS config
  const whitelist = [
    /https:\/\/.*lrs.gistory.me/,
    /https:\/\/.*lrs-fe.pages.dev/,
    /http:\/\/localhost:5173/,
  ];
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.some((regex) => regex.test(origin))) {
        callback(null, origin);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      oauth2RedirectUrl: `${configService.getOrThrow('API_URL')}/api/oauth2-redirect.html`,
      persistAuthorization: true,
    },
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000);
}
bootstrap();
