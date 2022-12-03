import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule, HttpService } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/User.entity';
import { Token } from './entity/token.entity';
import { UserRepository } from 'src/user/repository/User.Repository';
import { tokenRepository } from './repository/token.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, tokenRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
    HttpModule,
    UserModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [TypeOrmModule],
})
export class AuthModule {}
