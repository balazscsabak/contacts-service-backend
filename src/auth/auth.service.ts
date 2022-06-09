import { Injectable } from '@nestjs/common';
import { comparePassword } from 'src/common/helper/password.helper';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Partial<User>> {
    const user = await (
      await this.userService.findByEmail(username)
    ).toObject();

    if (user && (await comparePassword({ password, hash: user.password }))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: User) {
    const payload = user;

    return {
      ...payload,
      access_token: this.jwtService.sign(payload),
    };
  }
}
