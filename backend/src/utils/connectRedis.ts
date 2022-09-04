import { createClient } from 'redis';

const redisUrl =
  'redis://:p78cbcb5447f54d044dd7364a96046fe650aaf131714c1c8fcd7a68b2dd759f24@ec2-52-212-77-130.eu-west-1.compute.amazonaws.com:23570';

// const redisClient = createClient({
//   url: redisUrl,
// });

const redisClient = createClient();

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connected successfully');
    redisClient.set('try', 'Hello Welcome to Express with TypeORM');
  } catch (error) {
    console.log(error);
    setTimeout(connectRedis, 5000);
  }
};

connectRedis();

export default redisClient;
