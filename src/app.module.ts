import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwitterModule } from './twitter/twitter.module';
import { JjalbotModule } from './jjalbot/jjalbot.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TwitterModule,
    JjalbotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
