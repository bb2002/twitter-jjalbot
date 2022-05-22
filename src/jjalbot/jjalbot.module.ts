import { Module } from '@nestjs/common';
import { JjalbotService } from './jjalbot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JjalEntity } from './entities/Jjal.entity';
import { TweetWriteHistoryEntity } from './entities/TweetWriteHistory.entity';

@Module({
  providers: [JjalbotService],
  exports: [JjalbotService],
  imports: [TypeOrmModule.forFeature([JjalEntity, TweetWriteHistoryEntity])],
})
export class JjalbotModule {}
