import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { UserService } from '../user.service';
import { IdpService } from 'src/idp/idp.service';
import { UserInfo } from 'src/idp/types/userInfo.type';

@Injectable()
export class IdPStrategy extends PassportStrategy(Strategy, 'idp') {
  constructor(
    private readonly userService: UserService,
    private readonly idpService: IdpService,
  ) {
    super();
  }

  async validate(token: string): Promise<{
    idp: UserInfo;
    token: string;
  }> {
    const idp = await this.idpService.getUserInfo(token).catch(() => {
      throw new UnauthorizedException();
    });
    return { idp, token };
  }
}
