import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoomModule } from './room/room.module';
import { MovingCertificationModule } from './moving-certification/moving-certification.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./env/${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, ScheduleModule.forRoot()],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: process.env.DB_HOST,
          port: 3306,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME || 'bssm_reservation',
          synchronize: true,
          entities: [__dirname + '/**/entity/*.entity.{js,ts}'],
          logging: true,
        };
      },
    }),
    UserModule,
    AuthModule,
    RoomModule,
    MovingCertificationModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
