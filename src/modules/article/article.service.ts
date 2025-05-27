import { CacheService } from '@common/cache/cache.service';
import { ArticleEntity } from '@entities/article.entity';
import { NotFound } from '@exceptions/not-found.exception';
import { CreateArticleDto, UpdateArticleDto } from '@modules/article/dtos/create.dto';
import { ListQueryDto } from '@modules/article/dtos/list-query.dto';
import { UserService } from '@modules/user/user.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPayload } from '@types';
import { Between, FindOptionsWhere, ILike, Repository } from 'typeorm';

@Injectable()
export class ArticleService {
	private readonly prefix = 'articles:';

	constructor(
		@InjectRepository(ArticleEntity) private articleRepository: Repository<ArticleEntity>,
		private readonly userService: UserService,
		private readonly cacheService: CacheService,
	) {}

	public async getById(id: string) {
		const article = await this.articleRepository.findOneBy({
			id: id,
		});

		if (!article) {
			throw new NotFound('article', { id });
		}

		return article;
	}

	public async findAll(q: ListQueryDto) {
		const key = `${this.prefix}${JSON.stringify(q)}`;

		try {
			const cached = await this.cacheService.get(key);
			if (cached) return cached;
		} catch (_) {}

		const [items, total] = await this.articleRepository.findAndCount({
			where: this.buildArticleWhere(q),
			take: q.limit,
			skip: q.offset,
			order: { publishedAt: 'DESC' },
		});

		const data = { total, items };
		const tags = items.map((item) => item.id);
		await this.cacheService.setWithTags(key, JSON.stringify(data), '1h', tags);
		return data;
	}

	public async create(dto: CreateArticleDto, user: TokenPayload) {
		const author = await this.userService.getById(user.id);
		const article = this.articleRepository.create({ ...dto, author });

		await this.articleRepository.save(article);
		await this.cacheService.flush(this.prefix);
		return article;
	}

	public async update(id: string, dto: UpdateArticleDto, user: TokenPayload) {
		const article = await this.getById(id);

		if (article?.author.id !== user.id) {
			throw new ConflictException('This article doesnt belong to user');
		}

		await this.articleRepository.update(id, dto);
		await this.cacheService.invalidateTag(id);

		return this.articleRepository.findOneByOrFail({ id });
	}

	public async remove(id: string, user: TokenPayload) {
		const article = await this.getById(id);

		if (article?.author.id !== user.id) {
			throw new ConflictException('This article doesnt belong to user');
		}
		await this.articleRepository.delete(id);
		await this.cacheService.invalidateTag(id);
	}

	private buildArticleWhere(q: ListQueryDto): FindOptionsWhere<ArticleEntity>[] | FindOptionsWhere<ArticleEntity> {
		const where: FindOptionsWhere<ArticleEntity> = {};

		if (q.authorId) where.author = { id: q.authorId };

		if (q.fromDate || q.toDate) {
			where.publishedAt = Between(q.fromDate ?? '0001-01-01', q.toDate ?? '9999-12-31');
		}

		if (q.search) {
			return [
				{ ...where, title: ILike(`%${q.search}%`) },
				{ ...where, description: ILike(`%${q.search}%`) },
			];
		}

		return where;
	}
}
