import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { HttpModule } from '@nestjs/axios';
// import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [HttpModule],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationModule],
})
export class ReservationModule {}
