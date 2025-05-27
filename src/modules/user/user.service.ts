import { UserEntity } from '@entities/user.entity';
import { NotFound } from '@exceptions/not-found.exception';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
	constructor(@InjectRepository(UserEntity) private repo: Repository<UserEntity>) {}

	public async create(data: { email: string; password: string }) {
		const hash = await bcrypt.hash(data.password, 10);

		const user = this.repo.create({ email: data.email, passwordHash: hash });

		return await this.repo.save(user);
	}

	public async getByEmail(data: { email: string }) {
		const user = await this.repo.findOneBy({ email: data.email });

		if (!user) {
			throw new NotFound('user', data);
		}

		return user;
	}

	public async getById(id: string) {
		const user = await this.repo.findOneBy({
			id: id,
		});

		if (!user) {
			throw new NotFound('user', { id });
		}

		return user;
	}
}
