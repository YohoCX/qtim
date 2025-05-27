import { TypedConfigModule } from '@config/typed-config.module';
import { TypedConfigService } from '@config/typed-config.service';
import { createKeyv } from '@keyv/redis';
import { Module } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import { CacheService } from './cache.service';

@Module({
	imports: [TypedConfigModule],
	providers: [
		{
			provide: 'CACHE_INSTANCE',
			inject: [TypedConfigService],
			useFactory: (config: TypedConfigService) => {
				const secondary = createKeyv(config.get('redis_url'));
				return new Cacheable({ secondary, ttl: '4h' });
			},
		},
		CacheService,
	],
	exports: ['CACHE_INSTANCE', CacheService],
})
export class CacheModule {}
