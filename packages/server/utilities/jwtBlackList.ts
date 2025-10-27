import redisClient from "../config/redis.config";
import jwt from "jsonwebtoken";

const blacklistToken = async (token: string): Promise<void> => {
  const decodedToken = jwt.decode(token);

  if (
    decodedToken &&
    typeof decodedToken === "object" &&
    "exp" in decodedToken
  ) {
    const ttl = decodedToken.exp! - Math.floor(Date.now() / 1000);

    if (ttl > 0) {
      await redisClient.set(`bl_${token}`, "true", {
        EX: ttl,
      });
      console.log(`Token ${token} blacklisted for ${ttl} seconds.`);
    }
  }
};

const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const isBlacklisted = await redisClient.get(`bl_${token}`);
  return isBlacklisted !== null;
};

export { blacklistToken, isTokenBlacklisted };
