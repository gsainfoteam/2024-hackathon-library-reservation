import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ReservationModule } from './reveravtion/reservation.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, ReservationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
