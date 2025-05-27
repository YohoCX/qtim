import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { TokenPayload } from '@types';

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
	const req = ctx.switchToHttp().getRequest();
	return req.user as TokenPayload;
});
