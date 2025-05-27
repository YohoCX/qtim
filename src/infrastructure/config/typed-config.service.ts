import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './configuration';

type Leaves<T> = T extends object
	? {
			[K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never ? '' : `.${Leaves<T[K]>}`}`;
		}[keyof T]
	: never;

type LeafTypes<T, S extends string> = S extends `${infer T1}.${infer T2}`
	? T1 extends keyof T
		? LeafTypes<T[T1], T2>
		: never
	: S extends keyof T
		? T[S]
		: never;

@Injectable()
export class TypedConfigService {
	constructor(private configService: ConfigService) {}

	get<T extends Leaves<AppConfig>>(propertyPath: T): LeafTypes<AppConfig, T> {
		return this.configService.get(propertyPath) as LeafTypes<AppConfig, T>;
	}
}
