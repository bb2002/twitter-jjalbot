import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwitterModule } from './twitter/twitter.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TwitterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
