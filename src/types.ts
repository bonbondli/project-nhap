export interface QuestStep {
  question: string;
  options?: string[]; // Multiple choice options
  correctAnswer: string; // The correct answer text or letter index
  explanation: string;
  inputType?: "choice" | "text"; // Type of answering widget
}

export interface MathQuest {
  id: string;
  title: string;
  description: string;
  rewardPoints: number;
  steps: QuestStep[];
  emoji: string;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  role: string;
  avatar: string;
  emoji: string;
  accentColor: string; // Tailwind class like "teal-600"
  accentHex: string; // Hex color for special styles
  bgColor: string; // Tailwind background class like "bg-teal-50"
  borderColor: string;
  greeting: string;
  specialties: string[];
  interactiveQuests: MathQuest[];
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
  isQuestWidget?: boolean; // True if it triggers an interactive math card in the chat
  questId?: string;
  questStepIndex?: number;
  solvedStatus?: "unsolved" | "correct" | "incorrect";
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  pointsRequired?: number;
  questRequired?: string;
  unlocked: boolean;
}

export interface UserProfile {
  name: string;
  grade: "6" | "7" | "8" | "9";
  score: number;
  highScore: number;
  level: number;
  badges: string[]; // List of unlocked badge IDs
}
