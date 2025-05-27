import { ArticleEntity } from '@entities/article.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn('uuid') id!: string;
	@Column({ unique: true }) email!: string;
	@Column() passwordHash!: string;

	@OneToMany(
		() => ArticleEntity,
		(article) => article.author,
	)
	articles?: ArticleEntity[];

	@CreateDateColumn()
	createdAt!: Date;
}
