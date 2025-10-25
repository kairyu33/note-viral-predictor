/**
 * レート制限ユーティリティ
 *
 * IPアドレスベースでAPIリクエストを制限し、
 * 不正使用やコスト超過を防ぎます。
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// メモリベースのレート制限ストレージ
const rateLimitMap = new Map<string, RateLimitEntry>();

/**
 * レート制限設定
 */
const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 60 * 1000, // 1時間
  maxRequests: 10, // 1時間あたり最大10リクエスト
};

/**
 * レート制限をチェック
 *
 * @param identifier - IPアドレスまたはユーザーID
 * @returns 制限内ならtrue、超過ならfalse
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  // エントリが存在しない、または期限切れの場合
  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    };
    rateLimitMap.set(identifier, newEntry);

    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.maxRequests - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // 制限超過チェック
  if (entry.count >= RATE_LIMIT_CONFIG.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // カウントを増加
  entry.count += 1;
  rateLimitMap.set(identifier, entry);

  return {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * 古いエントリをクリーンアップ（メモリリーク防止）
 * 定期的に実行されるべき
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();

  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

// 1時間ごとにクリーンアップ
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 60 * 60 * 1000);
}

/**
 * リクエストからIPアドレスを取得
 *
 * @param request - Next.js Request
 * @returns IPアドレス
 */
export function getClientIp(request: Request): string {
  // Vercelの場合
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  // その他のヘッダーをチェック
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // フォールバック
  return 'unknown';
}
