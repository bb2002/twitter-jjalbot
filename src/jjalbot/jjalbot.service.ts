import { Injectable } from '@nestjs/common';
import { MentionTweet } from '../twitter/dto/mention-tweet.dto';
import { writeTweetByID } from '../common/libs/twitter.axios';

@Injectable()
export class JjalbotService {
  constructor() {}

  async addJjal(tweet: MentionTweet) {
  }

  async searchJjalWithOptions(tweet: MentionTweet) {
  }

  async searchJjalWithoutOptions(tweet: MentionTweet) {
  }
}
