import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { expires_in } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtTokenService: JwtService,
  ) {}

  async login(email: string, password: string) {
    if (!email || !password)
      return {
        success: false,
        message: 'Email and Password are required',
        user: null,
      };
    const result = await this.usersService.findOne(email, password);
    if (result?.success) {
      const jwt = await this.jwtTokenService.sign(result.user);
      return {
        ...result,
        access_token: jwt,
        expires_in,
      };
    } else {
      return result;
    }
  }
}
