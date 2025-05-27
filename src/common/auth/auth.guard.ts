import { TokenPayload } from '@common/types';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly authService: AuthService) {}

	async canActivate(ctx: ExecutionContext): Promise<boolean> {
		const req = ctx.switchToHttp().getRequest<FastifyRequest>();

		const auth = req.headers.authorization;

		if (!auth?.startsWith('Bearer ')) {
			throw new UnauthorizedException('Missing Bearer token');
		}

		const token = auth.slice(7);
		const payload = await this.authService.validateToken(token);

		if (!payload) {
			throw new UnauthorizedException();
		}

		(req as unknown as { user: TokenPayload }).user = payload;
		return true;
	}
}
