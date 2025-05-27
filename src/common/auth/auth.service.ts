import { CacheService } from '@common/cache/cache.service';
import { TypedConfigService } from '@config/typed-config.service';
import { UserEntity } from '@entities/user.entity';
import { UserService } from '@modules/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '@types';
import bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dtos';

@Injectable()
export class AuthService {
	private readonly jwt_secret: string;
	private readonly access_token_expire: string;
	private readonly refresh_token_expire: string;

	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly configService: TypedConfigService,
		private readonly cacheService: CacheService,
	) {
		this.jwt_secret = this.configService.get('jwt.secret');
		this.access_token_expire = this.configService.get('jwt.access_expires_in');
		this.refresh_token_expire = this.configService.get('jwt.refresh_expires_in');
	}

	public async register(dto: RegisterDto) {
		const user = await this.userService.create(dto);
		return this.returnTokenWithUser(user);
	}

	public async login(dto: LoginDto) {
		const user = await this.userService.getByEmail({ email: dto.email });
		if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) throw new UnauthorizedException();
		return this.returnTokenWithUser(user);
	}

	public async validateToken(token: string) {
		try {
			const decoded = await this.jwtService.verifyAsync<TokenPayload>(token, {
				secret: this.configService.get('jwt.secret'),
			});

			const cached = await this.cacheService.get<TokenPayload>(token);

			if (!cached) {
				return null;
			}

			return {
				id: decoded.id,
				email: decoded.email,
			};
		} catch {
			throw new UnauthorizedException('Invalid or expired token');
		}
	}

	public async regenerateToken(token: string) {
		const validatedPayload = await this.validateToken(token);

		if (!validatedPayload) {
			throw new UnauthorizedException();
		}

		return { access_token: await this.issueAccessToken(validatedPayload) };
	}

	private async returnTokenWithUser(user: UserEntity) {
		return {
			access_token: await this.issueAccessToken({
				id: user.id,
				email: user.email,
			}),
			refresh_token: await this.issueRefreshToken({
				id: user.id,
				email: user.email,
			}),
			user: user,
		};
	}

	private async issueAccessToken(payload: TokenPayload) {
		const token = await this.jwtService.signAsync(payload, {
			secret: this.jwt_secret,
			expiresIn: this.access_token_expire,
		});

		await this.cacheService.set(token, JSON.stringify(payload), this.access_token_expire);

		return token;
	}

	private async issueRefreshToken(payload: TokenPayload) {
		const token = await this.jwtService.signAsync(payload, {
			secret: this.jwt_secret,
			expiresIn: this.refresh_token_expire,
		});

		await this.cacheService.set(token, JSON.stringify(payload), this.refresh_token_expire);

		return token;
	}
}
