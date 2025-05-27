import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

@ApiSchema({ name: 'Register DTO' })
export class RegisterDto {
	@ApiProperty({
		description: 'User email',
		example: 'example@mail.com',
		type: String,
	})
	@IsEmail()
	email!: string;

	@ApiProperty({
		description: 'User password',
		example: 'qwerty',
		type: String,
	})
	@MinLength(6)
	password!: string;
}

@ApiSchema({ name: 'Login DTO' })
export class LoginDto extends RegisterDto {}
