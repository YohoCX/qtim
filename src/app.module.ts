import { AuthModule } from '@common/auth/auth.module';
import { CacheModule } from '@common/cache/cache.module';
import { TypeOrmModule } from '@common/db/type-orm.module';
import { TypedConfigModule } from '@config/typed-config.module';
import { ArticleModule } from '@modules/article/article.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';

@Module({
	imports: [TypedConfigModule, CacheModule, UserModule, AuthModule, ArticleModule, TypeOrmModule],
})
export class AppModule {}
