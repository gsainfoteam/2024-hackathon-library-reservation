import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { PuppeteerModule } from 'nest-puppeteer';
import { HttpModule } from '@nestjs/axios';
// import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PuppeteerModule.forFeature(), HttpModule, ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
