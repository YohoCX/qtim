import { UserEntity } from '@entities/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	Relation,
	UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ArticleEntity {
	@PrimaryGeneratedColumn('uuid') id!: string;
	@Column() title!: string;
	@Column({ type: 'text' }) description!: string;
	@Column({ type: 'date' }) publishedAt!: string;
	@ManyToOne(() => UserEntity, { eager: true }) author!: Relation<UserEntity>;
	@CreateDateColumn() createdAt!: Date;
	@UpdateDateColumn() updatedAt!: Date;
}
