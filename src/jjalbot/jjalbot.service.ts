import { Injectable } from '@nestjs/common';
import { MentionTweet } from '../twitter/dto/mention-tweet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JjalEntity } from './entities/Jjal.entity';
import { Like, Repository } from 'typeorm';
import { CommandObject } from '../twitter/dto/command.dto';
import { JjalBotOptions } from '../twitter/enums/jjalbot-command.enum';
import { writeTweetByID } from '../common/libs/twitter.axios';
import { TweetWriteHistoryEntity } from './entities/TweetWriteHistory.entity';

interface IWriteTweetWithLogs {
  tweet: MentionTweet;
  command: CommandObject;
  textOfTweet: string;
  mediaIds: string[];
}

@Injectable()
export class JjalbotService {
  constructor(
    @InjectRepository(JjalEntity)
    private readonly jjalRepository: Repository<JjalEntity>,
    @InjectRepository(TweetWriteHistoryEntity)
    private readonly tweetWriteHistoryRepository: Repository<TweetWriteHistoryEntity>,
  ) {}

  private async writeTweetWithLogs({
    tweet,
    command,
    textOfTweet,
    mediaIds,
  }: IWriteTweetWithLogs) {
    // 트위터에 글을 쓴다.
    await writeTweetByID(tweet.tweetId, textOfTweet, mediaIds);

    // 데이터베이스에 기록을 남긴다.
    const writeHistoryEntity = new TweetWriteHistoryEntity();
    writeHistoryEntity.tweetId = tweet.tweetId;
    writeHistoryEntity.payload = command.payload;
    writeHistoryEntity.isCommand = command.isCommand;
    writeHistoryEntity.outputText = textOfTweet;
    writeHistoryEntity.outputMedias = mediaIds;
    await this.tweetWriteHistoryRepository.save(writeHistoryEntity);
  }

  async addJjal(tweet: MentionTweet, command: CommandObject) {
    let title = '';
    {
      // 제목을 만듭니다. (없을수도 있음)
      for (const arg of command.root.args) {
        if (arg.option === JjalBotOptions.OPTION_TITLE) {
          title = arg.data.join('');
        }
      }
    }

    // 등록할 미디어가 없는 경우
    if (!tweet.media || tweet.media.length === 0) {
      await this.writeTweetWithLogs({
        tweet: tweet,
        command: command,
        mediaIds: null,
        textOfTweet: '등록할 미디어를 업로드 해 주세요. (media is empty)',
      });
      return;
    }

    // 여러 미디어가 있는 경우 같은 이름으로 등록시킨다.
    for (const m of tweet.media) {
      const jjalEntity = new JjalEntity();
      jjalEntity.mediaTitle = title === '' ? null : title;
      jjalEntity.tweetId = tweet.tweetId;
      jjalEntity.mediaKey = m.mediaKey;
      jjalEntity.mediaType = m.type;
      jjalEntity.mediaUrl = m.mediaUrl;
      jjalEntity.mentions = tweet.mentions;
      jjalEntity.hashtags = tweet.hashtags;
      await this.jjalRepository.save(jjalEntity);
    }

    await this.writeTweetWithLogs({
      tweet: tweet,
      command: command,
      mediaIds: null,
      textOfTweet: `${tweet.media.length}개를 등록했습니다. (added ${tweet.media.length} media)`,
    });
  }

  async searchJjalWithOptions(tweet: MentionTweet, command: CommandObject) {
    let exactMode: boolean;
    {
      // 정확히 같은지 모드를 사용하는가?
      exactMode = !!command.root.args.find(
        (value) => value.option === JjalBotOptions.OPTION_EXACT,
      );
    }

    {
      const isUseSearchTitle = command.root.args.find(
        (value) => value.option === JjalBotOptions.OPTION_TITLE,
      );
      if (isUseSearchTitle) {
        const searchText = isUseSearchTitle.data.join('');
        let selectedJjal: JjalEntity;
        if (exactMode) {
          selectedJjal = await this.jjalRepository.findOne({
            where: {
              mediaTitle: searchText,
            },
          });
        } else {
          selectedJjal = await this.jjalRepository.findOne({
            where: {
              mediaTitle: Like(`%${searchText}%`),
            },
          });
        }

        if (selectedJjal) {
          await this.writeTweetWithLogs({
            tweet: tweet,
            command: command,
            mediaIds: [selectedJjal.mediaKey],
            textOfTweet: '',
          });
        } else {
          await this.writeTweetWithLogs({
            tweet: tweet,
            command: command,
            mediaIds: null,
            textOfTweet: `검색 결과가 없습니다. (Not found)`,
          });
        }
      }
    }
  }

  async searchJjalWithoutOptions(tweet: MentionTweet, command: CommandObject) {
    const searchText = command.payload;

    let selectedJjal: JjalEntity;
    {
      // 제목 기반으로 짤 찾아보기
      const searchResult = await this.jjalRepository.find({
        where: [
          { mediaTitle: Like(`%${searchText}%`) },
          { hashtags: Like(`%${searchText}%`) },
        ],
      });

      if (searchResult.length === 0) {
        return;
      }

      if (searchResult.length === 1) {
        // 검색된 짤이 하나인 경우
        selectedJjal = searchResult[0];
      } else {
        for (const searchItem of searchResult) {
          if (
            searchItem.mediaTitle === searchText ||
            searchItem.hashtags?.indexOf(searchText) !== -1 ||
            searchItem.mentions?.indexOf(searchText) !== -1
          ) {
            // 제목이 정확히 같거나, 해시태그가 정확히 같거나, 등록자가 같은 경우
            selectedJjal = searchItem;
          }
        }
      }

      if (!selectedJjal) {
        // 전혀 없는 경우 랜덤으로 하나 선택
        selectedJjal =
          searchResult[Math.floor(Math.random() * searchResult.length)];
      }
    }

    if (selectedJjal) {
      await this.writeTweetWithLogs({
        tweet: tweet,
        command: command,
        mediaIds: [selectedJjal.mediaKey],
        textOfTweet: '',
      });
    } else {
      await this.writeTweetWithLogs({
        tweet: tweet,
        command: command,
        mediaIds: null,
        textOfTweet: `관련 짤이 없습니다. 새로 등록해보세요. (Not found)`,
      });
    }
  }
}
