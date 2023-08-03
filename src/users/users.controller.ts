import { Body, Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/users.entity';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from '../role/role.guard';
import { Roles } from 'src/role/role.decorator';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  @Roles('admin')
  @UseGuards(JWTAuthGuard)
  @Get('')
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => user);
  }

  @Get('profile')
  @UseGuards(JWTAuthGuard)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  getProfile(@Request() req: any) {
    return req.user;
  }
}
