import { AddStreamRuleDto } from '../../twitter/dto/add-stream-rule.dto';
import { OAuth10Helper, twitterAxios } from './create-axios-instance';
import request from 'request';

export const addStreamRule = (rules: AddStreamRuleDto) =>
  twitterAxios().post('/tweets/search/stream/rules', {
    add: [rules],
  });

export const getStreamRules = () =>
  twitterAxios().get('/tweets/search/stream/rules');

export const deleteStreamRules = (ids: string[]) =>
  twitterAxios().post('/tweets/search/stream/rules', {
    delete: {
      ids: ids,
    },
  });

export const getTweetStream = () =>
  twitterAxios().get(
    '/tweets/search/stream?tweet.fields=attachments,entities&expansions=attachments.media_keys&media.fields=url',
    {
      responseType: 'stream',
    },
  );

export const writeTweetByID = (
  targetTweetID: string,
  text: string,
  mediaIds: string[],
) => {
  const request = {
    url: 'https://api.twitter.com/2/tweets',
    method: 'POST',
  };

  const data = {
    text: text,
    reply: {
      in_reply_to_tweet_id: targetTweetID,
    },
  } as any;

  if (mediaIds && mediaIds.length !== 0) {
    data.media = {
      media_ids: mediaIds,
    };
  }

  return twitterAxios().post('/tweets', data, {
    headers: OAuth10Helper.getAuthHeaderForRequest(request) as any,
  });
};
