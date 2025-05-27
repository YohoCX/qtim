import { TypedConfigService } from '@config/typed-config.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './infrastructure/filters/http-exception.filter';
import { LoggingInterceptor } from './infrastructure/interceptors/logger.interceptor';
import { TransformInterceptor } from './infrastructure/interceptors/transform.interceptor';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
		logger: Logger,
	});

	const cfg = app.get(TypedConfigService);

	app.enableCors(); // CORS

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		}),
	);

	app.useGlobalFilters(new AllExceptionsFilter());

	app.useGlobalInterceptors(new TransformInterceptor());
	app.useGlobalInterceptors(new LoggingInterceptor());

	if (cfg.get('nodeEnv') !== 'production') {
		const swaggerConfig = new DocumentBuilder()
			.setTitle('Storage-Service API')
			.setDescription('REST & auth endpoints')
			.setVersion('1.0')
			.addBearerAuth(
				{ type: 'http', bearerFormat: 'JWT', in: 'header', name: 'Authorization', scheme: 'Bearer' },
				'access-token',
			)
			.addSecurityRequirements('access-token')
			.build();

		const doc = SwaggerModule.createDocument(app, swaggerConfig);
		SwaggerModule.setup('api/v1/docs', app, doc, {
			swaggerOptions: { persistAuthorization: true },
		});
	}

	const port = cfg.get('port') || 3000;
	await app.listen(port, '0.0.0.0');

	console.log(`Application is running on port ${port}`);
}

bootstrap();
