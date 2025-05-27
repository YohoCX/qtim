import process from 'node:process';

export interface AppConfig {
	nodeEnv: 'development' | 'production' | 'test';
	port: number;
	postgres: {
		host: string;
		port: number;
		user: string;
		password: string;
		database: string;
	};
	bcrypt_salt: string;
	redis_url: string;
	jwt: {
		secret: string;
		access_expires_in: string;
		refresh_expires_in: string;
	};
}

export default (): AppConfig => ({
	nodeEnv: process.env.NODE_ENV as 'development' | 'production' | 'test',
	port: Number.parseInt(process.env.PORT as string, 10),
	postgres: {
		host: process.env.POSTGRES_HOST as string,
		port: Number.parseInt(process.env.POSTGRES_PORT as string, 10),
		user: process.env.POSTGRES_USER as string,
		password: process.env.POSTGRES_PASSWORD as string,
		database: process.env.POSTGRES_DATABASE as string,
	},
	bcrypt_salt: process.env.BCRYPT_SALT as string,
	redis_url: process.env.REDIS_URL as string,
	jwt: {
		secret: process.env.JWT_SECRET as string,
		access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN as string,
		refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN as string,
	},
});
