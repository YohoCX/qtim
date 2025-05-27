import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const res = ctx.getResponse<FastifyReply>();
		const req = ctx.getRequest<FastifyRequest>();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = 'Internal server error';

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			const errRes = exception.getResponse() as unknown as string | HttpException;
			message =
				typeof errRes === 'string'
					? errRes
					: (Array.isArray((errRes as HttpException).message)
							? (errRes.message as unknown as []).join('; ')
							: errRes.message) || message;
		}

		const errorPayload = {
			statusCode: status,
			message,
			timestamp: new Date().toISOString(),
			path: req.url,
		};

		console.error(
			`${req.method} ${req.url} → ${status} : ${message}`,
			exception instanceof Error ? exception.stack : undefined,
		);

		return res.status(status).send({
			data: null,
			error: errorPayload,
		});
	}
}
