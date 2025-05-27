import { AuthGuard } from '@common/auth/auth.guard';
import { ArticleService } from '@modules/article/article.service';
import { ListQueryDto } from '@modules/article/dtos/list-query.dto';
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { TokenPayload } from '@types';
import { CurrentUser } from 'src/infrastructure/decorators/current-user.decorator';
import { CreateArticleDto, UpdateArticleDto } from './dtos/create.dto';

@Controller('articles')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@ApiOperation({ summary: 'Create Article' })
	@UseGuards(AuthGuard)
	@Post()
	public async create(@Body() dto: CreateArticleDto, @CurrentUser() author: TokenPayload) {
		return this.articleService.create(dto, author);
	}

	@ApiOperation({ summary: 'List Articles' })
	@Get()
	public async findAll(@Query() query: ListQueryDto) {
		return this.articleService.findAll(query);
	}

	@ApiOperation({ summary: 'Get One Article By ID' })
	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.articleService.getById(id);
	}

	@ApiOperation({ summary: 'Update Article by ID' })
	@UseGuards(AuthGuard)
	@Patch(':id')
	public async update(@Param('id') id: string, @Body() dto: UpdateArticleDto, @CurrentUser() author: TokenPayload) {
		return this.articleService.update(id, dto, author);
	}

	@ApiOperation({ summary: 'Delete Article by ID' })
	@UseGuards(AuthGuard)
	@Delete(':id')
	public async remove(@Param('id') id: string, @CurrentUser() author: TokenPayload) {
		return this.articleService.remove(id, author);
	}
}
