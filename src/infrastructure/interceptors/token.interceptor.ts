import { AuthService } from '@common/auth/auth.service';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Observable, from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
	constructor(private readonly authService: AuthService) {}

	intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
		const req = ctx.switchToHttp().getRequest<FastifyRequest>();
		const res = ctx.switchToHttp().getResponse<FastifyReply>();

		const refresh = req.headers['x-refresh-token'] as string | undefined;
		if (!refresh) return next.handle();

		return from(this.authService.regenerateToken(refresh)).pipe(
			tap((newToken) => res.header('x-access-token', newToken)),
			switchMap(() => next.handle()),
		);
	}
}
