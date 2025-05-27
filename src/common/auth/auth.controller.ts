import { AuthService } from '@common/auth/auth.service';
import { LoginDto, RegisterDto } from '@common/auth/dtos';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	public async register(@Body() body: RegisterDto) {
		return this.authService.register(body);
	}

	@Post('login')
	public async login(@Body() body: LoginDto) {
		return this.authService.login(body);
	}
}
