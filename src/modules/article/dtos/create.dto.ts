import { ApiProperty, ApiSchema, PartialType } from '@nestjs/swagger';
import { IsISO8601, IsString, MinLength } from 'class-validator';

@ApiSchema({ name: 'Create Article' })
export class CreateArticleDto {
	@ApiProperty({
		description: 'Article Title',
		example: 'Doing Testing Task',
		type: String,
	})
	@IsString()
	@MinLength(3)
	title!: string;

	@ApiProperty({
		description: 'Article Description',
		example: 'Took few hours',
		type: String,
	})
	@IsString()
	@MinLength(10)
	description!: string;

	@ApiProperty({
		description: 'PublishedDate',
		example: '2025-05-27',
		type: String,
	})
	@IsISO8601()
	publishedAt!: string;
}

@ApiSchema({ name: 'Update Article' })
export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
