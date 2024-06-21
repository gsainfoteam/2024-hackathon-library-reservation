import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ReservationModule } from './reveravtion/reservation.module';
import { PuppeteerModule } from 'nest-puppeteer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    ReservationModule,
    PuppeteerModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
