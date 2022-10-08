import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '9310',
      database: 'bibleTrainTest',
      synchronize: false,
      entities: [
        UserAuthority,
        User,
        Train,
        TrainProfile,
        Bible,
        BibleTrack,
        CheckStamp,
      ],
      logging: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
