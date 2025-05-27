import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cacheable, CacheableItem } from 'cacheable';

@Injectable()
export class CacheService {
	constructor(@Inject('CACHE_INSTANCE') private readonly cache: Cacheable) {}

	async get<T>(key: string): Promise<T> {
		const data = await this.cache.get<string>(key);

		if (!data) {
			throw new NotFoundException({
				code: 404,
				message: 'Not found in Cache',
			});
		}

		return JSON.parse(data);
	}

	public async set(key: string, value: string, ttl: number | string = 900_000): Promise<void> {
		await this.cache.set(key, value, ttl);
	}

	public async delete(key: string): Promise<void> {
		await this.cache.delete(key);
	}

	public async flush(prefix: string): Promise<void> {
		// @ts-ignore
		const client = this.cache.secondary._store._client;
		const batchSize = 1000;

		const buffer: string[] = [];
		for await (const key of client.scanIterator({ MATCH: `${prefix}*`, COUNT: batchSize })) {
			buffer.push(key);

			if (buffer.length === batchSize) {
				await client.unlink(...buffer);
				buffer.length = 0;
			}
		}

		if (buffer.length) {
			await client.unlink(...buffer);
		}
	}

	public async setWithTags(key: string, value: string, ttlMs: string, tags: string[]) {
		await this.cache.set(key, value, ttlMs);

		const tagsToCache: CacheableItem[] = [];
		for (const tag of tags) {
			tagsToCache.push({
				key: `tag:${tag}`,
				value: key,
				ttl: ttlMs,
			});
		}
		await this.cache.setMany(tagsToCache);
	}

	async invalidateTag(tag: string) {
		const data: string | undefined = await this.cache.get(`tag:${tag}`);

		if (!data) {
			return;
		}

		await this.cache.delete(data);
	}
}
