import { Injectable, Logger } from '@nestjs/common';
import { User } from './dto/user.dto';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor() {}

  async setConsent(user: User): Promise<User> {
    this.logger.log('setConsent called');
    return user;
  }
}
