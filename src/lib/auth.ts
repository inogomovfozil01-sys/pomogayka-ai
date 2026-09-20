import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

/**
 * Validates Telegram Login Widget auth data
 * secret_key = SHA256(bot_token)
 */
export function verifyTelegramLoginWidget(
  authData: Record<string, string | number>
): boolean {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return false;

  const { hash, ...data } = authData;
  if (!hash) return false;

  const checkString = Object.keys(data)
    .sort()
    .map((k) => `${k}=${data[k]}`)
    .join("\n");

  const secretKey = crypto.createHash("sha256").update(token).digest();
  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex");

  return hmac === hash;
}

/**
 * Validates Telegram Mini App initData
 * secret_key = HMAC_SHA256("WebAppData", bot_token)
 */
export function verifyTelegramWebAppData(initDataRaw: string): {
  isValid: boolean;
  user?: {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
  };
} {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { isValid: false };

  try {
    const params = new URLSearchParams(initDataRaw);
    const hash = params.get("hash");
    if (!hash) return { isValid: false };

    params.delete("hash");

    // Sort keys alphabetically
    const keys = Array.from(params.keys()).sort();
    const checkString = keys.map((k) => `${k}=${params.get(k)}`).join("\n");

    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(token)
      .digest();

    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(checkString)
      .digest("hex");

    if (calculatedHash !== hash) {
      return { isValid: false };
    }

    const userRaw = params.get("user");
    const user = userRaw ? JSON.parse(userRaw) : undefined;

    return { isValid: true, user };
  } catch (err) {
    console.error("Error validating Telegram WebApp initData:", err);
    return { isValid: false };
  }
}

/**
 * Creates or updates user from Telegram data and generates session
 */
export async function createOrUpdateTelegramUser(data: {
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
}) {
  const adminIds = (process.env.ADMIN_TELEGRAM_IDS || "")
    .split(",")
    .map((id) => id.trim());
  const isEnvAdmin = adminIds.includes(String(data.telegramId));

  const role = isEnvAdmin ? "ADMIN" : "USER";

  const user = await prisma.user.upsert({
    where: { telegramId: BigInt(data.telegramId) },
    update: {
      username: data.username || undefined,
      firstName: data.firstName || undefined,
      lastName: data.lastName || undefined,
      photoUrl: data.photoUrl || undefined,
      ...(isEnvAdmin ? { role: "ADMIN" } : {}),
    },
    create: {
      telegramId: BigInt(data.telegramId),
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      photoUrl: data.photoUrl,
      role,
    },
  });

  // Create session token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await prisma.siteSession.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  return { user, token };
}

/**
 * Get current session user from cookies
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("pomogayka_session")?.value;
    if (!token) return null;

    const session = await prisma.siteSession.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return session.user;
  } catch {
    return null;
  }
}

/**
 * Check if user has admin privileges
 */
export function isUserAdmin(user: { telegramId?: bigint | null; role?: string } | null): boolean {
  if (!user) return false;
  if (user.role === "ADMIN" || user.role === "OWNER") return true;

  if (user.telegramId) {
    const adminIds = (process.env.ADMIN_TELEGRAM_IDS || "")
      .split(",")
      .map((id) => id.trim());
    return adminIds.includes(user.telegramId.toString());
  }

  return false;
}
