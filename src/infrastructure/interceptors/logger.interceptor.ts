import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly log = new Logger(LoggingInterceptor.name);

	intercept(ctx: ExecutionContext, next: CallHandler) {
		const req = ctx.switchToHttp().getRequest();
		const now = Date.now();

		this.log.log(`${req.method} ${req.url} → started`);

		return next.handle().pipe(tap(() => this.log.log(`${req.method} ${req.url} ← ${Date.now() - now}ms`)));
	}
}
