import axios from 'axios';
import * as OAuth from 'oauth-1.0a';
import * as crypto from 'crypto';

class OAuth10Helper {
  static getAuthHeaderForRequest(request: any) {
    const oauth = new OAuth({
      consumer: {
        key: process.env.TWITTER_CONSUMER_KEY,
        secret: process.env.TWITTER_CONSUMER_SECRET,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto
          .createHmac('sha1', key)
          .update(base_string)
          .digest('base64');
      },
    });

    const authorization = oauth.authorize(request, {
      key: process.env.TWITTER_ACCESS_TOKEN,
      secret: process.env.TWITTER_TOKEN_SECRET,
    });

    return oauth.toHeader(authorization);
  }
}

export const twitterAxios = () =>
  axios.create({
    baseURL: 'https://api.twitter.com/2',
    timeout: 3000,
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    },
  });
