import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { TypedConfigService } from './typed-config.service';
import { validationSchema } from './validation';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
			validationSchema,
			envFilePath: ['.env.development.local', '.env'],
		}),
	],
	providers: [TypedConfigService],
	exports: [TypedConfigService],
})
export class TypedConfigModule {}
