import { ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsISO8601, IsOptional, IsUUID, Max, Min, ValidateIf } from 'class-validator';

@ApiSchema({ name: 'List Articles' })
export class ListQueryDto {
	@ApiPropertyOptional({
		minimum: 1,
		maximum: 100,
		default: 10,
		example: 20,
	})
	@IsOptional()
	@Transform(({ value }) => Number(value))
	@Type(() => Number)
	@Min(1)
	@Max(100)
	limit = 10;

	@ApiPropertyOptional({
		minimum: 0,
		default: 0,
		example: 40,
	})
	@IsOptional()
	@Transform(({ value }) => Number(value))
	@Type(() => Number)
	@Min(0)
	offset = 0;

	@ApiPropertyOptional({
		format: 'uuid',
		example: 'f1b2ec0d-42aa-4e1a-93c0-a1d4c1e8f9b7',
	})
	@IsOptional()
	@IsUUID('4')
	authorId?: string;

	@ApiPropertyOptional({ type: String, example: '2025-01-01' })
	@IsOptional()
	@IsISO8601()
	fromDate?: string;

	@ApiPropertyOptional({ type: String, example: '2025-05-01' })
	@IsOptional()
	@IsISO8601()
	toDate?: string;

	@ApiPropertyOptional({ example: 'nestjs cache' })
	@IsOptional()
	search?: string;

	@ValidateIf((o) => o.fromDate && o.toDate && o.fromDate > o.toDate)
	alwaysFail? = false;
}
