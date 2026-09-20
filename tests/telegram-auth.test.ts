import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { verifyTelegramLoginWidget, verifyTelegramWebAppData } from "../src/lib/auth";

describe("Telegram Authentication Security", () => {
  const mockToken = "123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ";

  it("should validate legitimate Telegram Login Widget hash", () => {
    process.env.TELEGRAM_BOT_TOKEN = mockToken;

    const data: Record<string, string | number> = {
      id: 6564196947,
      first_name: "DFZ",
      username: "realDFZ",
      auth_date: 1710000000,
    };

    // Calculate valid hash
    const checkString = Object.keys(data)
      .sort()
      .map((k) => `${k}=${data[k]}`)
      .join("\n");

    const secretKey = crypto.createHash("sha256").update(mockToken).digest();
    const validHash = crypto
      .createHmac("sha256", secretKey)
      .update(checkString)
      .digest("hex");

    data.hash = validHash;

    expect(verifyTelegramLoginWidget(data)).toBe(true);

    // Tampered data should fail
    const tampered = { ...data, first_name: "Hacker" };
    expect(verifyTelegramLoginWidget(tampered)).toBe(false);
  });

  it("should validate legitimate Telegram WebApp initData", () => {
    process.env.TELEGRAM_BOT_TOKEN = mockToken;

    const userObj = { id: 6564196947, first_name: "DFZ", username: "realDFZ" };
    const params = new URLSearchParams();
    params.set("auth_date", "1710000000");
    params.set("query_id", "AAG_TEST");
    params.set("user", JSON.stringify(userObj));

    // Keys sorted
    const keys = Array.from(params.keys()).sort();
    const checkString = keys.map((k) => `${k}=${params.get(k)}`).join("\n");

    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(mockToken)
      .digest();

    const validHash = crypto
      .createHmac("sha256", secretKey)
      .update(checkString)
      .digest("hex");

    params.set("hash", validHash);

    const result = verifyTelegramWebAppData(params.toString());
    expect(result.isValid).toBe(true);
    expect(result.user?.id).toBe(6564196947);
    expect(result.user?.username).toBe("realDFZ");

    // Altering query should fail
    params.set("auth_date", "1710000001");
    const tamperedResult = verifyTelegramWebAppData(params.toString());
    expect(tamperedResult.isValid).toBe(false);
  });
});
