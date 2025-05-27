import Joi from 'joi';

export const validationSchema = Joi.object({
	NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
	PORT: Joi.number().default(3000),

	POSTGRES_HOST: Joi.string().default('localhost'),
	POSTGRES_PORT: Joi.number().port().default('5432'),
	POSTGRES_USER: Joi.string().default('postgres'),
	POSTGRES_PASSWORD: Joi.string().default('postgres'),
	POSTGRES_DATABASE: Joi.string().default('qtim'),

	REDIS_URL: Joi.string().uri().required(),

	JWT_SECRET: Joi.string().min(16).required(),
	JWT_ACCESS_EXPIRES_IN: Joi.string().default('3600s'),
	JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),

	BCRYPT_SALT: Joi.number().default(10),
});
