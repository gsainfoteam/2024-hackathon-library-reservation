import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from './dto/req/login.dto';
import { Request, Response } from 'express';
import { JwtToken } from './dto/res/jwtToken.dto';
import { UserService } from './user.service';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LogoutDto } from './dto/req/logout.dto';

@ApiTags('user')
@Controller('user')
@UsePipes(ValidationPipe)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Login with idp',
    description:
      'idp redirect to this endpoint with code, then this endpoint return jwt token to users',
  })
  @ApiOkResponse({ type: JwtToken, description: 'Return jwt token' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @Get('login')
  async loginByIdP(
    @Query() { code, type }: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JwtToken> {
    const { refresh_token, ...token } = await this.userService.login({
      code,
      type:
        type ??
        ((req.headers['user-agent'] as string).includes('Dart')
          ? 'flutter'
          : 'web'),
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return { ...token };
  }

  @ApiOperation({
    summary: 'Refresh token',
    description: 'Refresh the access token from idp',
  })
  @ApiCreatedResponse({ type: JwtToken, description: 'Return jwt token' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JwtToken> {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) throw new UnauthorizedException();
    const { refresh_token, ...token } =
      await this.userService.refresh(refreshToken);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return { ...token };
  }

  @ApiOperation({
    summary: 'Logout',
    description: 'Logout the user from the cookie and idp',
  })
  @ApiCreatedResponse({ description: 'Return jwt token' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @Post('logout')
  async logout(
    @Body() { access_token }: LogoutDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) throw new UnauthorizedException();
    res.clearCookie('refresh_token');
    return this.userService.logout(access_token, refreshToken);
  }
}
