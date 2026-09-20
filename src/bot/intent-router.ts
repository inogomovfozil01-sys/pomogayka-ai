import type { IntentClassification } from "../lib/types";

// Common casual Russian, Uzbek, English greetings and chatter roots
const CASUAL_PHRASE_ROOTS = [
  "привет", "ку", "хай", "здравствуйте", "доброе утро", "добрый день", "добрый вечер",
  "салам", "салом", "salom", "hello", "hi", "hey",
  "кто в школу", "кто идет в школу", "кто сегодня в школу", "как дела", "что делаете",
  "ахах", "хаха", "лол", "ору", "кринж", "пон", "ок", "ладно", "понял", "ясно",
  "спасибо", "спс", "рахмат", "rahmat", "thanks", "thx", "благодарю",
  "пока", "спокойной ночи", "бб", "бай", "bye", "goodnight"
];

// Regex to extract task numbers like "8", "8, 9", "8 и 9", "5-10", "№ 8"
const TASK_NUMBERS_REGEX = /(?:№|номер|задани[ея]|задача|упражнени[ея]|task|ex)?\s*([0-9]+(?:\s*[-–—]\s*[0-9]+)?(?:\s*[,и]\s*[0-9]+)*)/i;

export function classifyIntent(text: string, hasPhoto: boolean): IntentClassification {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  // If there's a photo and either no text or short text
  if (hasPhoto) {
    const requestedTasks = extractTaskNumbers(trimmed);
    return {
      isHelpRequest: true,
      isCasualChat: false,
      isVerification: isVerificationQuery(lower),
      isContinuation: false,
      requestedTasks,
      confidence: 0.95,
    };
  }

  // Check verification
  const isVerification = isVerificationQuery(lower);

  // Check if it's a continuation query, e.g. "а 10?", "а следующее?", "почему в 9 получилось 16000?"
  const isContinuation = isContinuationQuery(lower);

  // Check if it contains help keywords or specific task numbers
  const hasHelpKeywords = containsHelpKeywords(lower);

  // Check if it's purely casual chatter
  const isCasual =
    CASUAL_PHRASE_ROOTS.some((root) => {
      return (
        lower === root ||
        lower.startsWith(root + " ") ||
        lower.startsWith(root + "!") ||
        lower.startsWith(root + "?") ||
        lower.startsWith(root)
      );
    }) && !hasHelpKeywords && !isVerification && !isContinuation;

  if (isCasual && lower.length < 50) {
    return {
      isHelpRequest: false,
      isCasualChat: true,
      isVerification: false,
      isContinuation: false,
      requestedTasks: [],
      confidence: 0.9,
    };
  }

  const isHelp = hasHelpKeywords || isContinuation || isVerification;
  const requestedTasks = extractTaskNumbers(trimmed);

  return {
    isHelpRequest: isHelp,
    isCasualChat: !isHelp && isCasual,
    isVerification,
    isContinuation,
    requestedTasks,
    confidence: isHelp ? 0.85 : 0.6,
  };
}

function containsHelpKeywords(lower: string): boolean {
  return (
    lower.includes("помоги") ||
    lower.includes("помогите") ||
    lower.includes("реши") ||
    lower.includes("решите") ||
    lower.includes("объясни") ||
    lower.includes("объясните") ||
    lower.includes("как решить") ||
    lower.includes("подскажи") ||
    lower.includes("подскажите") ||
    lower.includes("что такое") ||
    lower.includes("yordam") || // Uzbek: help
    lower.includes("yeching") || // Uzbek: solve
    lower.includes("tushuntir") || // Uzbek: explain
    lower.includes("help") ||
    lower.includes("solve") ||
    lower.includes("explain") ||
    (TASK_NUMBERS_REGEX.test(lower) && /[0-9]/.test(lower))
  );
}

function isContinuationQuery(lower: string): boolean {
  return (
    /^а\s+(?:№\s*)?[0-9]+/i.test(lower) ||
    lower.startsWith("а следующее") ||
    lower.startsWith("а дальше") ||
    lower.startsWith("почему в ") ||
    lower.startsWith("почему здесь ") ||
    lower.startsWith("откуда взялось") ||
    lower.startsWith("а как во 2")
  );
}

function isVerificationQuery(lower: string): boolean {
  return (
    lower.includes("правильно") ||
    lower.includes("верно") ||
    lower.includes("я правильно") ||
    lower.includes("проверь") ||
    lower.includes("проверьте") ||
    lower.includes("to'g'ri") || // Uzbek: to'g'rimi
    lower.includes("correct")
  );
}

export function extractTaskNumbers(text: string): string[] {
  const match = text.match(TASK_NUMBERS_REGEX);
  if (!match || !match[1]) return [];

  const raw = match[1].trim();

  // Check range like "5-10" or "5–10"
  const rangeMatch = raw.match(/^([0-9]+)\s*[-–—]\s*([0-9]+)$/);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10);
    const end = parseInt(rangeMatch[2], 10);
    if (start <= end && end - start <= 15) {
      const nums: string[] = [];
      for (let i = start; i <= end; i++) {
        nums.push(i.toString());
      }
      return nums;
    }
  }

  // Split by comma or "и"
  const parts = raw.split(/[,и]/i).map((p) => p.trim()).filter(Boolean);
  return parts.length > 0 ? parts : [raw];
}
