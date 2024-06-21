import { ReservationService } from './reservation.service';

export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}
}
