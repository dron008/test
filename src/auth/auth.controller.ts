import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @ApiResponse({ type: AuthEntity })
  login(@Body() dto: AuthDto) {
    const { email, password } = dto;
    return this.authService.login(email, password);
  }

  @Post('register')
  @ApiResponse({ type: AuthEntity })
  register(@Body() dto: AuthDto) {
    const { email, password } = dto;
    console.log({ email, password });
    return this.authService.register(dto);
  }
}
