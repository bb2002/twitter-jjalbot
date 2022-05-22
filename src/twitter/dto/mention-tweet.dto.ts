import { IsArray, IsNumber, IsString } from 'class-validator';

export class MentionTweetMatchingRule {
  @IsNumber()
  id: string;

  @IsString()
  tag: string;
}

export class MentionTweetMedia {
  @IsString()
  mediaKey: string;

  @IsString()
  type: string;

  @IsString()
  mediaUrl: string;
}

export class MentionTweet {
  @IsNumber()
  tweetId: string;

  @IsString()
  text: string;

  @IsArray()
  media: MentionTweetMedia[];

  @IsArray()
  hashtags: string[];

  @IsArray()
  mentions: string[];

  @IsArray()
  matchingRules: MentionTweetMatchingRule[];

  static make(raw) {
    const dto = new MentionTweet();
    dto.tweetId = raw.data.id;
    dto.text = raw.data.text.split('https://')[0];
    dto.matchingRules = raw.matching_rules?.map((value) => {
      const ruleDto = new MentionTweetMatchingRule();
      ruleDto.id = value.id;
      ruleDto.tag = value.tag;
      return ruleDto;
    });
    dto.media = raw.includes?.media?.map((value) => {
      const mediaDto = new MentionTweetMedia();
      mediaDto.mediaUrl = value.url;
      mediaDto.mediaKey = value.media_key?.split('_')[1];
      mediaDto.type = value.type;
      return mediaDto;
    });
    dto.hashtags = raw.data.entities?.hashtags?.map((value) => value.tag);
    dto.mentions = raw.data.entities?.mentions?.map((value) => value.username);
    return dto;
  }
}
