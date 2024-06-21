import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { PuppeteerModule } from 'nest-puppeteer';
// import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PuppeteerModule.forFeature()],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
