import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'src/user/user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}
  @Get()
  getAuth() {
    return this.AuthService.getAuth();
  }

  @Post('signup')
  signUp(@Body() user: CreateUserDto) {
    return this.AuthService.signUp(user);
  }

  @Post('signin')
  signIn(@Body() credentials: LoginUserDto) {
    const { email, password } = credentials;

    return this.AuthService.signIn(email, password);
  }
}
