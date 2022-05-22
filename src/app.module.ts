import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwitterModule } from './twitter/twitter.module';
import { JjalbotModule } from './jjalbot/jjalbot.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TweetWriteHistoryEntity } from './jjalbot/entities/TweetWriteHistory.entity';
import { JjalEntity } from './jjalbot/entities/Jjal.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.production.env'
          : '.development.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DATABASE_HOST'),
        port: 3306,
        username: config.get('DATABASE_USER'),
        password: config.get('DATABASE_PASS'),
        database: config.get('DATABASE_NAME'),
        entities: [TweetWriteHistoryEntity, JjalEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TwitterModule,
    JjalbotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
