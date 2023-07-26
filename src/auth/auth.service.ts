import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from './entity/auth.entity';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    // if no user is found throe an error
    if (!user) {
      throw new NotFoundException(`No user found for email : ${email}`);
    }

    // check if the password is correct
    // const isPasswordValid = user.password === password;
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new NotFoundException('Invalid Password');
    }

    return {
      accessToken: this.jwtService.sign({ userID: user.id }),
    };
  }

  async register(dto: AuthDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    const register = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
      },
    });
    return register;
  }
}
