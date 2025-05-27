import { CacheModule } from '@common/cache/cache.module';
import { ArticleEntity } from '@entities/article.entity';
import { ArticleController } from '@modules/article/article.controller';
import { ArticleService } from '@modules/article/article.service';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [UserModule, CacheModule, TypeOrmModule.forFeature([ArticleEntity])],
	providers: [ArticleService],
	controllers: [ArticleController],
})
export class ArticleModule {}
