import jwt, { SignOptions } from 'jsonwebtoken';
import config from 'config';

//We are going to generate both refresh and access tokens and store them in HTTPOnly cookies.
//An access token should have a Private and Public key. The same applies to a refresh token.

//Sign Access or Refresh Token
export const signJwt = (
  payload: Object,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options: SignOptions
) => {
  // Buffer decodes the encoded private keys to an ASCII string.
  const privateKey = Buffer.from(
    config.get<string>(keyName),
    'base64'
  ).toString('ascii');
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

//Verify Access or Refresh Token
export const verifyJwt = <T>(
  token: string,
  keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
): T | null => {
  try {
    const publicKey = Buffer.from(
      config.get<string>(keyName),
      'base64'
    ).toString('ascii');
    const decoded = jwt.verify(token, publicKey) as T;

    return decoded;
  } catch (error) {
    return null;
  }
};
