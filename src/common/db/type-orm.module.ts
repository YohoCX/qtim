import { TypedConfigModule } from '@config/typed-config.module';
import { TypedConfigService } from '@config/typed-config.service';
import { ArticleEntity } from '@entities/article.entity';
import { UserEntity } from '@entities/user.entity';
import { Global, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Global()
@Module({
	imports: [TypedConfigModule],
	providers: [
		{
			provide: DataSource,
			inject: [TypedConfigService],
			useFactory: async (config: TypedConfigService) => {
				try {
					const dataSource = new DataSource({
						type: 'postgres',
						host: config.get('postgres.host'),
						port: config.get('postgres.port'),
						username: config.get('postgres.user'),
						password: config.get('postgres.password'),
						database: config.get('postgres.database'),
						synchronize: true,
						entities: [ArticleEntity, UserEntity],
					});
					await dataSource.initialize();
					console.log('Database connected successfully');
					return dataSource;
				} catch (error) {
					console.log('Error connecting to database');
					throw error;
				}
			},
		},
	],
	exports: [DataSource],
})
export class TypeOrmModule {}
