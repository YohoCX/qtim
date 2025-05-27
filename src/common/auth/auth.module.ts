import { CacheModule } from '@common/cache/cache.module';
import { UserModule } from '@modules/user/user.module';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Global()
@Module({
	imports: [UserModule, CacheModule, JwtModule],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
