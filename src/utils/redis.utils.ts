import { RedisClient, redisClient } from "./connect";

class RedisUtils {
  private client: RedisClient;

  constructor() {
    this.client = redisClient!;
  }

  async storeString(key: string, value: string, expiry: number = 3600) {
    await this.client.set(key, value);
    await this.client.expire(key, expiry);
  }

  async getString(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async storeObject(key: string, value: any, expiry: number = 3600) {
    await this.client.hSet(key, value);
    await this.client.expire(key, expiry);
  }

  async getObject(key: string): Promise<any | null> {
    return await this.client.hGetAll(key);
  }

  async delete(key: string) {
    await this.client.del(key);
  }
}

export default new RedisUtils();
