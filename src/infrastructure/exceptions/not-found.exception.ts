import { NotFoundException } from '@nestjs/common';

export class NotFound extends NotFoundException {
	constructor(subject: string, data: Record<string, string>) {
		super({
			message: `${subject} not found`,
			data,
			code: 404,
		});
	}
}
