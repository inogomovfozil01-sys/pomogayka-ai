export type LearningMode = "ONLY_ANSWER" | "SOLUTION" | "TEACH_ME" | "VERIFY";

export type AIMode =
  | "OFF"
  | "MENTION_ONLY"
  | "HELP_REQUESTS"
  | "PHOTOS_AND_HELP"
  | "ALWAYS_ASSIST";

export interface SolveTaskItem {
  taskNumber: string; // e.g. "8", "9", "Задание 1"
  conditionText: string; // Extracted or recognized text of the exercise
  steps: string[]; // Step-by-step logic
  finalAnswer: string; // Direct concise final answer
  explanation?: string; // Optional simple breakdown
  isUnreadable?: boolean; // If text is blurry, dark, cut off
}

export interface SolveHomeworkResult {
  subject: string; // e.g. "Математика", "Алгебра", "Русский язык", "Физика"
  grade: number; // e.g. 4, 8, 11
  language: "ru" | "uz" | "en";
  tasks: SolveTaskItem[];
  rawText?: string;
  isVerification?: boolean;
  verificationResult?: {
    isCorrect: boolean;
    feedback: string;
    mistakeStep?: string;
    correctedAnswer?: string;
  };
  unreadableWarning?: string;
}

export interface IntentClassification {
  isHelpRequest: boolean;
  isCasualChat: boolean;
  isVerification: boolean;
  isContinuation: boolean; // e.g. "а 10?", "почему в 9?"
  requestedTasks: string[]; // e.g. ["8", "9"]
  detectedSubject?: string;
  confidence: number;
}
