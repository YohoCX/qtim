import { type CallHandler, type ExecutionContext, Injectable, type NestInterceptor } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, { data: T; error: null }> {
	intercept(context: ExecutionContext, next: CallHandler<T>): Observable<{ data: T; error: null }> {
		return next.handle().pipe(
			map((payload) => ({
				data: payload,
				error: null,
			})),
		);
	}
}
