import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const isRedisConfigured = !!(redisUrl && redisToken);

const redis = isRedisConfigured ? new Redis({
  url: redisUrl,
  token: redisToken,
}) : null;

// Configuración a 100 requests por minuto por IP
const ratelimit = isRedisConfigured ? new Ratelimit({
  redis: redis!,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
}) : null;

export async function checkRateLimit(ip: string = "anonymous") {
  if (!isRedisConfigured || !ratelimit) {
    console.warn("⚠️ Rate limiter: Variables de Upstash Redis no configuradas. Fallback a permitir la request.");
    return { success: true };
  }

  try {
    const result = await ratelimit.limit(`ratelimit_${ip}`);
    return result;
  } catch (error) {
    console.error("Rate limiter: Error conectando a Redis", error);
    // Graceful degradation en caso de que Redis esté caído temporalmente
    return { success: true };
  }
}

const authRatelimit = isRedisConfigured ? new Ratelimit({
  redis: redis!,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
}) : null;

export async function checkAuthRateLimit(ip: string = "anonymous") {
  if (!isRedisConfigured || !authRatelimit) {
    console.warn("⚠️ Auth Rate limiter: Fallback a permitir la request.");
    return { success: true };
  }

  try {
    const result = await authRatelimit.limit(`auth_ratelimit_${ip}`);
    return result;
  } catch (error) {
    console.error("Auth Rate limiter: Error conectando a Redis", error);
    return { success: true };
  }
}
