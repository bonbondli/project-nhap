import React, { useState, useEffect, useRef } from "react";
import {
  Award,
  BookOpen,
  ChevronRight,
  Clock,
  HelpCircle,
  Info,
  Lock,
  MessageSquare,
  Play,
  RefreshCw,
  Send,
  Sparkles,
  Trophy,
  Unlock,
  Volume2,
  VolumeX,
  Zap,
  CheckCircle,
  AlertCircle,
  User,
  GraduationCap
} from "lucide-react";

import { CHARACTERS, BADGES_LIST, MATH_RIDDLES_VI } from "./charactersData";
import { Character, Message, Badge, UserProfile, MathQuest } from "./types";
import { synth } from "./audio";

export default function App() {
  // Onboarding & Profile State
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>("");
  const [userGrade, setUserGrade] = useState<"6" | "7" | "8" | "9">("6");

  // User Profile State (Points, level, etc.)
  const [profile, setProfile] = useState<UserProfile>({
    name: "Học sinh ưu tú",
    grade: "6",
    score: 0,
    highScore: 0,
    level: 1,
    badges: []
  });

  // Sound Mute State
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Character Selection State
  const [activeChar, setActiveChar] = useState<Character>(CHARACTERS[0]);

  // Chat History per Character State
  const [chatHistories, setChatHistories] = useState<Record<string, Message[]>>({});
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isThinking, setIsThinking] = useState<boolean>(false);

  // Active Quest State (when a student is inside a multi-step lesson)
  const [activeQuest, setActiveQuest] = useState<{
    quest: MathQuest;
    stepIndex: number;
    charId: string;
  } | null>(null);

  // Speedrun Game State
  const [speedrunActive, setSpeedrunActive] = useState<boolean>(false);
  const [speedrunTimer, setSpeedrunTimer] = useState<number>(0);
  const [speedrunScore, setSpeedrunScore] = useState<number>(0);
  const [speedrunStreak, setSpeedrunStreak] = useState<number>(0);
  const [speedrunQuestion, setSpeedrunQuestion] = useState<{
    question: string;
    options: string[];
    answer: string;
  } | null>(null);
  const [speedrunFeedback, setSpeedrunFeedback] = useState<{
    isCorrect: boolean;
    text: string;
    show: boolean;
  }>({ isCorrect: false, text: "", show: false });

  // System status for Gemini key (toggled automatically based on response source)
  const [apiMode, setApiMode] = useState<"gemini" | "simulation">("simulation");
  const [showKeyGuide, setShowKeyGuide] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speedrunTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and load from LocalStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem("math_quest_profile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
        setUserName(parsed.name || "");
        setUserGrade(parsed.grade || "6");
        setShowOnboarding(false);
      } catch (e) {
        console.error("Failed to parse stored profile", e);
      }
    }

    // Initialize all chat histories with character greetings
    const initialHistories: Record<string, Message[]> = {};
    CHARACTERS.forEach((char) => {
      initialHistories[char.id] = [
        {
          id: `greet_${char.id}`,
          text: char.greeting,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    });
    setChatHistories(initialHistories);
  }, []);

  // Save profile state to LocalStorage
  const saveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem("math_quest_profile", JSON.stringify(updatedProfile));
  };

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistories, activeChar.id, isThinking]);

  // Speedrun Timer hook
  useEffect(() => {
    if (speedrunActive && speedrunTimer > 0) {
      speedrunTimerRef.current = setTimeout(() => {
        setSpeedrunTimer((prev) => prev - 1);
      }, 1000);
    } else if (speedrunActive && speedrunTimer === 0) {
      // Game Over
      setSpeedrunActive(false);
      // Double check high scores
      let newHighScore = profile.highScore;
      if (speedrunScore > profile.highScore) {
        newHighScore = speedrunScore;
        synth.playLevelUp();
      } else {
        synth.playPop();
      }
      
      // Award extra points to total score
      const bonusPoints = speedrunScore;
      const updatedScore = profile.score + bonusPoints;
      const newLevel = Math.floor(updatedScore / 50) + 1;
      const leveledUp = newLevel > profile.level;
      
      if (leveledUp) {
        synth.playLevelUp();
      }

      const updatedProfile = {
        ...profile,
        score: updatedScore,
        highScore: newHighScore,
        level: newLevel
      };
      
      saveProfile(updatedProfile);
      
      // Trigger a chatbot notification in the current window
      const botMsg: Message = {
        id: `speedrun_done_${Date.now()}`,
        text: `⚡ KẾT QUẢ THỬ THÁCH TỐC ĐỘ: Bạn đã trả lời đúng ${speedrunScore / 5} câu hỏi, đạt được +${bonusPoints} điểm Toán thuật! ${
          speedrunScore > profile.highScore ? "🏆 KỶ LỤC MỚI ĐÃ ĐƯỢC THIẾT LẬP!" : ""
        } Hãy tiếp tục luyện tập để nhanh hơn nữa nhé!`,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatHistories((prev) => ({
        ...prev,
        [activeChar.id]: [...(prev[activeChar.id] || []), botMsg]
      }));
    }

    return () => {
      if (speedrunTimerRef.current) clearTimeout(speedrunTimerRef.current);
    };
  }, [speedrunActive, speedrunTimer]);

  // Handle Mute Toggle
  const handleMuteToggle = () => {
    const nextMuted = synth.toggleMute();
    setIsMuted(nextMuted);
  };

  // Onboarding Form Submit
  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = userName.trim() || "Học sinh ưu tú";
    const initialProfile: UserProfile = {
      name: finalName,
      grade: userGrade,
      score: 0,
      highScore: 0,
      level: 1,
      badges: []
    };
    saveProfile(initialProfile);
    setShowOnboarding(false);
    synth.playLevelUp();
  };

  // Get active history
  const activeHistory = chatHistories[activeChar.id] || [];

  // Helper to get grade label
  const getGradeLabel = (grade: "6" | "7" | "8" | "9") => `Lớp ${grade}`;

  // Helper to earn points and check badges
  const addPoints = (points: number, currentProfile: UserProfile, completedQuestId?: string) => {
    const newScore = currentProfile.score + points;
    const newLevel = Math.floor(newScore / 50) + 1;
    const isLeveledUp = newLevel > currentProfile.level;

    // Check Badge achievements
    const newlyUnlockedBadges = [...currentProfile.badges];
    
    BADGES_LIST.forEach((badge) => {
      if (newlyUnlockedBadges.includes(badge.id)) return;

      // Unlock based on points
      if (badge.pointsRequired && newScore >= badge.pointsRequired) {
        newlyUnlockedBadges.push(badge.id);
      }

      // Unlock based on quest
      if (badge.questRequired && completedQuestId && badge.questRequired === completedQuestId) {
        newlyUnlockedBadges.push(badge.id);
      }
    });

    if (isLeveledUp) {
      synth.playLevelUp();
    } else {
      synth.playCorrect();
    }

    const updatedProfile = {
      ...currentProfile,
      score: newScore,
      level: newLevel,
      badges: newlyUnlockedBadges
    };

    saveProfile(updatedProfile);
    return { levelUp: isLeveledUp, unlockedCount: newlyUnlockedBadges.length - currentProfile.badges.length };
  };

  // Start an interactive mathematical quest
  const startQuest = (quest: MathQuest) => {
    if (activeQuest) {
      // Clear current quest
      setActiveQuest(null);
    }

    setActiveQuest({
      quest,
      stepIndex: 0,
      charId: activeChar.id
    });

    // Inject system and character messages about quest start
    const step = quest.steps[0];
    const questStartMsg: Message = {
      id: `quest_start_${quest.id}_${Date.now()}`,
      text: `🌟 BẮT ĐẦU THỬ THÁCH: "${quest.title}" (+${quest.rewardPoints} Điểm thưởng). Hãy rèn luyện bộ não của em để trả lời các câu hỏi cực kỳ thú vị từ ${activeChar.name}!`,
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const questQuestionMsg: Message = {
      id: `quest_q_${quest.id}_0_${Date.now()}`,
      text: step.question,
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isQuestWidget: true,
      questId: quest.id,
      questStepIndex: 0,
      solvedStatus: "unsolved"
    };

    setChatHistories((prev) => ({
      ...prev,
      [activeChar.id]: [...(prev[activeChar.id] || []), questStartMsg, questQuestionMsg]
    }));

    synth.playPop();
  };

  // Submit answer for interactive quest widget
  const handleQuestAnswer = (questId: string, stepIndex: number, selectedAns: string, messageId: string) => {
    if (!activeQuest || activeQuest.quest.id !== questId || activeQuest.stepIndex !== stepIndex) return;

    const quest = activeQuest.quest;
    const step = quest.steps[stepIndex];
    const isCorrect = selectedAns === step.correctAnswer;

    // Update the message state so the widget renders as solved (correct or incorrect)
    setChatHistories((prev) => {
      const history = prev[activeChar.id] || [];
      const updated = history.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            solvedStatus: isCorrect ? ("correct" as const) : ("incorrect" as const)
          };
        }
        return msg;
      });
      return { ...prev, [activeChar.id]: updated };
    });

    // Create reaction messages
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `quest_user_ans_${Date.now()}`,
      text: `Em chọn đáp án: ${selectedAns}`,
      sender: "user",
      timestamp: nowStr
    };

    if (isCorrect) {
      synth.playCorrect();
      
      const isLastStep = stepIndex === quest.steps.length - 1;
      const pointsEarned = isLastStep ? quest.rewardPoints : 5; // 5 pts for progress, main reward on finish

      const result = addPoints(pointsEarned, profile, isLastStep ? quest.id : undefined);

      const botReaction: Message = {
        id: `quest_bot_reaction_${Date.now()}`,
        text: `🎉 CHÍNH XÁC! ${step.explanation} Em nhận được +${pointsEarned} điểm Toán thuật! ${
          isLastStep ? `\n\n🏆 CHÚC MỪNG! Em đã hoàn thành xuất sắc thử thách "${quest.title}". Thầy/Cô rất tự hào về em!` : ""
        }`,
        sender: "bot",
        timestamp: nowStr
      };

      setChatHistories((prev) => {
        const current = prev[activeChar.id] || [];
        const nextHist = [...current, userMsg, botReaction];

        // If there's a next step, append it!
        if (!isLastStep) {
          const nextIndex = stepIndex + 1;
          const nextStep = quest.steps[nextIndex];
          
          // Move activeQuest state forward
          setActiveQuest({
            quest,
            stepIndex: nextIndex,
            charId: activeChar.id
          });

          const nextQuestionMsg: Message = {
            id: `quest_q_${quest.id}_${nextIndex}_${Date.now()}`,
            text: nextStep.question,
            sender: "bot",
            timestamp: nowStr,
            isQuestWidget: true,
            questId: quest.id,
            questStepIndex: nextIndex,
            solvedStatus: "unsolved"
          };
          nextHist.push(nextQuestionMsg);
        } else {
          // Finished quest!
          setActiveQuest(null);
        }

        return { ...prev, [activeChar.id]: nextHist };
      });

    } else {
      synth.playIncorrect();
      // Wrong answer
      const botReaction: Message = {
        id: `quest_bot_reaction_${Date.now()}`,
        text: `😅 Chưa chính xác rồi em ơi! Đừng nản lòng nhé. Hãy xem hướng dẫn của cô/thầy nè: \n\n"${step.explanation}"\n\nHãy thử lại một câu đố khác hoặc tiếp tục trò chuyện tự do nhé!`,
        sender: "bot",
        timestamp: nowStr
      };

      setChatHistories((prev) => ({
        ...prev,
        [activeChar.id]: [...(prev[activeChar.id] || []), userMsg, botReaction]
      }));

      // Terminate quest on error so they can restart or chat freely
      setActiveQuest(null);
    }
  };

  // Submit free text message to backend
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isThinking) return;

    const textToSend = inputMessage;
    setInputMessage("");
    setIsThinking(true);
    synth.playPop();

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      text: textToSend,
      sender: "user",
      timestamp
    };

    // Update local history immediately
    const currentHist = activeHistory;
    setChatHistories((prev) => ({
      ...prev,
      [activeChar.id]: [...(prev[activeChar.id] || []), userMessage]
    }));

    try {
      // Call express full-stack API route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          character: activeChar.id,
          message: textToSend,
          history: currentHist,
          gradeName: `Lớp ${profile.grade}`
        }),
      });

      const data = await response.json();
      setIsThinking(false);
      synth.playPop();

      // Detect if Gemini API responded or local simulation did
      if (data.source === "gemini") {
        setApiMode("gemini");
      } else {
        setApiMode("simulation");
      }

      const botMessage: Message = {
        id: `bot_${Date.now()}`,
        text: data.text,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistories((prev) => ({
        ...prev,
        [activeChar.id]: [...(prev[activeChar.id] || []), botMessage]
      }));

      // Award 1 point for active chatting to encourage dialogue
      addPoints(1, profile);

    } catch (err) {
      console.error("Failed to connect to full-stack backend:", err);
      setIsThinking(false);
      synth.playIncorrect();

      // Local browser fallback in case server goes completely missing (extremely robust SPA fallback!)
      const localReplyText = generateClientFallbackReply(activeChar.id, textToSend, profile.grade);
      const botMessage: Message = {
        id: `bot_fallback_${Date.now()}`,
        text: localReplyText,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistories((prev) => ({
        ...prev,
        [activeChar.id]: [...(prev[activeChar.id] || []), botMessage]
      }));
    }
  };

  // Local static reply generator if offline / fetch fails
  const generateClientFallbackReply = (charId: string, text: string, grade: string): string => {
    const t = text.toLowerCase();
    if (charId === "pythagore") {
      if (t.includes("đố") || t.includes("câu đố")) {
        return "Ta có câu đố cổ điển này cho môn đồ: Có một mảnh đất hình chữ nhật dài 8m, rộng 6m. Để rào quanh mảnh đất, ta cần tính đường chéo nối hai góc đối diện. Đường chéo đó dài bao nhiêu mét hỡi môn sinh? (Gợi ý: Dùng định lý Pythagore nhé!)";
      }
      return "Ta đã ghi nhận câu hỏi của môn sinh. Trong toán học cổ đại, các con số luôn nắm giữ chiếc chìa khóa tối cao của vũ trụ. Em hãy mở Thử thách ma thuật dưới thanh công cụ của ta để chúng ta thử thách tư duy sâu rộng hơn nhé!";
    } else if (charId === "thaovy") {
      if (t.includes("đố") || t.includes("câu đố")) {
        return "Ăn bánh thôi nào! 🍕 Cô Vy có một ổ bánh bông lan siêu ngon. Cô chia đều cho 5 bạn nhỏ trong lớp. Đến phút chót, có thêm 1 bạn học sinh giỏi xuất sắc tham gia. Để chia đều lại cho cả 6 bạn, mỗi bạn sẽ nhận được bớt đi bao nhiêu phần của chiếc bánh gốc? Đố em tính ra phân số đó nha!";
      }
      return "Hihi cô Vy nghe rồi nè! Bài toán này thực ra rất đơn giản nếu em quy đổi nó về dạng thực tế đời sống. Thử bấm nút 'Luyện tập cùng Thầy Cô' phía dưới để trải nghiệm ngay những bài toán trà sữa siêu bánh cuốn nha!";
    } else if (charId === "logicbot") {
      return "*BÍP BỐP...* Tín hiệu thu nhận bị nhiễu sóng nhẹ. Tuy nhiên, bộ xử lý Logic-Bot đề xuất: Hãy tham gia 'Thử thách Toán học Tốc độ' ở bảng Bento bên phải để rèn luyện tốc độ phản xạ nhị phân của bạn ngay lập tức! *Tít tít...*";
    } else {
      return "Cánh cổng ma thuật lấp lánh đang phản hồi câu hỏi của Chiến binh Toán thuật! Hãy giữ vững niềm đam mê toán phép thuật nhé. Hãy giải những phương trình ma thuật ở bảng thử thách của tớ để lấy điểm tích lũy đổi những chiếc huy hiệu lung linh nha! ✨🔮";
    }
  };

  // Switch Companion Character
  const handleSelectCharacter = (char: Character) => {
    setActiveChar(char);
    synth.playPop();
  };

  // --- Speedrun Mini-Game Logic ---

  const generateSpeedrunQuestion = (grade: "6" | "7" | "8" | "9") => {
    let a = 0;
    let b = 0;
    let op = "+";
    let question = "";
    let answer = 0;
    let options: string[] = [];

    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    if (grade === "6") {
      const type = rand(0, 2);
      if (type === 0) {
        a = rand(10, 50);
        b = rand(10, 50);
        question = `${a} + ${b}`;
        answer = a + b;
      } else if (type === 1) {
        a = rand(30, 80);
        b = rand(10, 29);
        question = `${a} - ${b}`;
        answer = a - b;
      } else {
        a = rand(2, 9);
        b = rand(3, 12);
        question = `${a} × ${b}`;
        answer = a * b;
      }
    } else if (grade === "7") {
      const type = rand(0, 2);
      if (type === 0) {
        a = rand(-20, 20);
        b = rand(5, 30);
        question = `${a} + (${b})`;
        answer = a + b;
      } else if (type === 1) {
        a = rand(5, 15);
        b = rand(-15, -1);
        question = `${a} - (${b})`;
        answer = a - b;
      } else {
        const percents = [10, 20, 50, 25];
        const p = percents[rand(0, 3)];
        const mults = [40, 80, 120, 200];
        a = mults[rand(0, 3)];
        question = `${p}% của ${a}`;
        answer = (a * p) / 100;
      }
    } else if (grade === "8") {
      const type = rand(0, 2);
      if (type === 0) {
        a = rand(2, 12);
        question = `${a}²`;
        answer = a * a;
      } else if (type === 1) {
        a = rand(2, 5);
        const x = rand(2, 9);
        question = `Tìm x: ${a}x = ${a * x}`;
        answer = x;
      } else {
        a = rand(10, 25);
        b = rand(1, 9);
        question = `Tính: 2 × ${a} + ${b}`;
        answer = 2 * a + b;
      }
    } else {
      const type = rand(0, 2);
      if (type === 0) {
        const roots = [4, 9, 16, 25, 36, 49, 64, 81, 100];
        const r = roots[rand(0, 8)];
        question = `√${r}`;
        answer = Math.sqrt(r);
      } else if (type === 1) {
        const x = rand(2, 7);
        question = `Tìm x > 0: x² = ${x * x}`;
        answer = x;
      } else {
        a = rand(2, 4);
        const x = rand(2, 8);
        const constant = rand(1, 9);
        question = `Tìm x: ${a}x - ${constant} = ${a * x - constant}`;
        answer = x;
      }
    }

    const correctStr = String(answer);
    const optSet = new Set<string>();
    optSet.add(correctStr);

    while (optSet.size < 4) {
      const wrong = answer + rand(-10, 10);
      if (wrong !== answer) {
        optSet.add(String(wrong));
      }
    }

    options = Array.from(optSet).sort(() => Math.random() - 0.5);

    return { question, options, answer: correctStr };
  };

  const startSpeedrun = () => {
    setSpeedrunActive(true);
    setSpeedrunTimer(30);
    setSpeedrunScore(0);
    setSpeedrunStreak(0);
    setSpeedrunFeedback({ show: false, text: "", isCorrect: false });
    
    const initialQ = generateSpeedrunQuestion(profile.grade);
    setSpeedrunQuestion(initialQ);
    synth.playPop();
  };

  const handleSpeedrunAnswer = (selected: string) => {
    if (!speedrunQuestion) return;

    const isCorrect = selected === speedrunQuestion.answer;
    
    if (isCorrect) {
      synth.playCorrect();
      const pointsAdded = 5 + Math.min(speedrunStreak, 5); // Combo streak bonus points!
      setSpeedrunScore((prev) => prev + pointsAdded);
      setSpeedrunStreak((prev) => prev + 1);
      setSpeedrunFeedback({
        show: true,
        isCorrect: true,
        text: `+${pointsAdded} điểm (Chuỗi ${speedrunStreak + 1}🔥)`
      });
    } else {
      synth.playIncorrect();
      setSpeedrunStreak(0);
      // Penalty: deduct 1 second
      setSpeedrunTimer((prev) => Math.max(prev - 2, 0));
      setSpeedrunFeedback({
        show: true,
        isCorrect: false,
        text: "Sai rồi! -2 giây ⏰"
      });
    }

    // Hide feedback after 0.8s and load next question
    setTimeout(() => {
      const nextQ = generateSpeedrunQuestion(profile.grade);
      setSpeedrunQuestion(nextQ);
      setSpeedrunFeedback((prev) => ({ ...prev, show: false }));
    }, 600);
  };

  // Reset profile (Clear localStorage to start over)
  const handleResetProfile = () => {
    localStorage.removeItem("math_quest_profile");
    setProfile({
      name: "Học sinh ưu tú",
      grade: "6",
      score: 0,
      highScore: 0,
      level: 1,
      badges: []
    });
    setUserName("");
    setUserGrade("6");
    setShowOnboarding(true);
    synth.playPop();
  };

  // Find percentage of progress to next level (each level is 50 points)
  const levelProgressPercent = ((profile.score % 50) / 50) * 100;

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 flex flex-col font-sans transition-all duration-300">
      
      {/* Onboarding Dialog */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-8 border border-slate-100 transform transition-all scale-100 duration-300">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-full bg-teal-50 text-teal-600 mb-4 animate-bounce">
                <GraduationCap className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Chào mừng em đến với Toán Học Nhập Vai!</h2>
              <p className="text-slate-500 text-sm mt-2 font-medium">
                Hãy cho các Thầy Cô biết tên và khối lớp của em để thiết lập các thử thách toán học phù hợp nhất nhé.
              </p>
            </div>

            <form onSubmit={handleOnboardingSubmit} className="space-y-5">
              <div>
                <label className="block text-slate-700 font-semibold text-sm mb-2" htmlFor="student-name">
                  Tên của em là gì?
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    id="student-name"
                    type="text"
                    required
                    placeholder="Ví dụ: Minh Khôi, Khánh Vy..."
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-medium text-slate-700 transition"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold text-sm mb-2">
                  Em đang học lớp mấy? (THCS)
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {(["6", "7", "8", "9"] as const).map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      className={`py-3 rounded-xl border font-bold text-lg transition ${
                        userGrade === grade
                          ? "bg-teal-600 border-teal-600 text-white shadow-md"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                      onClick={() => setUserGrade(grade)}
                    >
                      Lớp {grade}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold rounded-xl transition shadow-lg hover:shadow-teal-100 flex items-center justify-center gap-2 mt-2"
              >
                <span>Bắt Đầu Khám Phá!</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 bg-white border-b border-slate-100 z-30 px-6 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-600 text-white rounded-xl shadow-md shadow-teal-100 flex items-center justify-center">
              <Sparkles className="w-6 h-6 animate-pulse-slow" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <span>Toán Học Nhập Vai</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold">MATHQUEST AI</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">Chatbot đồng hành toán học thông minh cho học sinh THCS</p>
            </div>
          </div>

          {/* User Scorecard Dashboard */}
          <div className="flex flex-wrap items-center gap-3 md:gap-5">
            
            {/* User Profile Summary */}
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2 border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm shadow-xs">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 leading-none">{profile.name}</p>
                <span className="text-[10px] font-bold text-slate-500">Lớp {profile.grade} • Cấp độ {profile.level}</span>
              </div>
            </div>

            {/* Total Points */}
            <div className="flex items-center gap-2 bg-teal-50 border border-teal-100/60 rounded-xl px-4 py-2">
              <Zap className="w-5 h-5 text-teal-600 animate-bounce" />
              <div>
                <p className="text-xs text-teal-700 font-semibold leading-none">Toán thuật</p>
                <p className="text-lg font-bold text-teal-800 leading-none mt-1">{profile.score} <span className="text-xs font-medium text-teal-600">điểm</span></p>
              </div>
            </div>

            {/* High Score */}
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100/60 rounded-xl px-4 py-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-xs text-amber-700 font-semibold leading-none">Kỷ lục tính nhanh</p>
                <p className="text-lg font-bold text-amber-800 leading-none mt-1">{profile.highScore} <span className="text-xs font-medium text-amber-600">điểm</span></p>
              </div>
            </div>

            {/* Audio Toggle button */}
            <button
              onClick={handleMuteToggle}
              className={`p-3 rounded-xl border transition ${
                isMuted
                  ? "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600"
                  : "bg-teal-50 border-teal-100 text-teal-600 hover:bg-teal-100"
              }`}
              title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            
          </div>

        </div>
      </header>

      {/* Main Container Bento Grid Layout */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-6 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: CHARACTER SELECTOR & TROPHY ROOM (4 cols on desktop) */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Bento Grid Item 1: Level Progress */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Học lực toán học</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-600">Cấp độ {profile.level}</span>
              <span className="text-xs font-bold text-teal-600">Tiến trình lên Cấp {profile.level + 1} ({profile.score % 50}/50)</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-2">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-500 shadow-inner"
                style={{ width: `${levelProgressPercent}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">Cứ tích lũy thêm 50 điểm Toán thuật bằng cách trả lời câu hỏi tự do hoặc thử thách để nâng cấp bậc học vị!</p>
          </div>

          {/* Bento Grid Item 2: Character Companion Selector */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex-1 flex flex-col">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              <span>Đồng hành toán học</span>
            </h3>
            
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {CHARACTERS.map((char) => {
                const isActive = char.id === activeChar.id;
                return (
                  <button
                    key={char.id}
                    onClick={() => handleSelectCharacter(char)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 group relative overflow-hidden ${
                      isActive
                        ? `bg-slate-50 border-${char.accentColor} shadow-md`
                        : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-xs"
                    }`}
                  >
                    {/* Left glow line */}
                    {isActive && (
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-${char.accentColor}`}></div>
                    )}

                    {/* Character Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        referrerPolicy="no-referrer"
                        src={char.avatar}
                        alt={char.name}
                        className={`w-12 h-12 rounded-full object-cover border-2 transition ${
                          isActive ? `border-${char.accentColor}` : "border-slate-200 group-hover:border-slate-300"
                        }`}
                      />
                      <span className="absolute -bottom-1 -right-1 text-xl">{char.emoji}</span>
                    </div>

                    {/* Character Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-slate-950 transition">{char.name}</h4>
                        {isActive && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-${char.accentColor}/10 text-${char.accentColor}`}>
                            Đang học
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate font-medium">{char.title}</p>
                      <p className="text-[10px] text-slate-400 mt-1 truncate italic font-medium">{char.role}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Profile Reset action - humble and small */}
            <div className="border-t border-slate-100 mt-5 pt-3 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Bắt đầu lại từ đầu?</span>
              <button
                onClick={handleResetProfile}
                className="text-slate-500 hover:text-red-500 font-semibold transition flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Đặt lại hồ sơ</span>
              </button>
            </div>

          </div>

        </section>

        {/* MIDDLE COLUMN: ACTIVE CHAT WINDOW (5 cols on desktop) */}
        <section className="lg:col-span-5 flex flex-col bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden h-[600px] md:h-[650px]">
          
          {/* Chat Header */}
          <div className={`p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  referrerPolicy="no-referrer"
                  src={activeChar.avatar}
                  alt={activeChar.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <span className="absolute -bottom-0.5 -right-0.5 text-md">{activeChar.emoji}</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm leading-tight">{activeChar.name}</h3>
                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5 max-w-[220px]">
                  {activeChar.role}
                </p>
              </div>
            </div>

            {/* AI Engine Status badge */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowKeyGuide(!showKeyGuide)}
                className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full transition ${
                  apiMode === "gemini"
                    ? "bg-teal-50 text-teal-700 border border-teal-100"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${apiMode === "gemini" ? "bg-teal-500" : "bg-slate-400"}`}></span>
                <span>{apiMode === "gemini" ? "AI Cực Đỉnh" : "Phản Hồi Sẵn"}</span>
                <Info className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Key configuration guide (Accordion panel) */}
          {showKeyGuide && (
            <div className="bg-teal-50/90 border-b border-teal-100/60 p-4 text-xs text-slate-700 animate-fade-in">
              <h4 className="font-bold text-teal-800 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Trải nghiệm AI Siêu Cấp cùng Thầy Cô!</span>
              </h4>
              <p className="leading-relaxed mt-1 text-slate-600 font-medium">
                Ứng dụng hiện đang chạy chế độ mô phỏng tình huống hóm hỉnh cực kỳ chất lượng. Để mở khóa **Trí tuệ Nhân tạo Gemini tự do hoàn toàn**, hãy cấu hình khóa <code className="bg-white px-1.5 py-0.5 border border-slate-200 rounded text-teal-700 font-mono font-bold">GEMINI_API_KEY</code> trong bảng **Settings &gt; Secrets** của giao diện Google AI Studio. Các Thầy Cô sẽ tự động sở hữu siêu trí tuệ để trò chuyện thông minh bất tận về mọi bài toán khó!
              </p>
              <button
                onClick={() => setShowKeyGuide(false)}
                className="mt-2 text-teal-700 hover:text-teal-900 font-bold underline cursor-pointer"
              >
                Đã hiểu, đóng hướng dẫn
              </button>
            </div>
          )}

          {/* Message List area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {activeHistory.map((msg) => {
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isBot ? "justify-start" : "justify-end"} items-end gap-2`}
                >
                  {/* Bot Avatar beside bubble */}
                  {isBot && (
                    <img
                      referrerPolicy="no-referrer"
                      src={activeChar.avatar}
                      alt={activeChar.name}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                  )}

                  {/* Standard text bubble */}
                  <div className="max-w-[82%] flex flex-col">
                    
                    {/* The message widget (if interactive quest card) */}
                    {msg.isQuestWidget && msg.questId && msg.questStepIndex !== undefined ? (
                      <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm my-1 space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-b border-slate-50 pb-2">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                            <span>BÀI HỌC TƯƠNG TÁC</span>
                          </span>
                          <span>Bước {msg.questStepIndex + 1}</span>
                        </div>
                        
                        <p className="text-xs font-bold text-slate-700 leading-relaxed font-sans">{msg.text}</p>
                        
                        {/* Choice Widget buttons */}
                        {msg.solvedStatus === "unsolved" ? (
                          <div className="grid grid-cols-1 gap-2 pt-1">
                            {CHARACTERS.find((c) => c.id === activeChar.id)
                              ?.interactiveQuests.find((q) => q.id === msg.questId)
                              ?.steps[msg.questStepIndex]?.options?.map((option) => (
                                <button
                                  key={option}
                                  onClick={() =>
                                    handleQuestAnswer(msg.questId!, msg.questStepIndex!, option, msg.id)
                                  }
                                  className="w-full text-left p-3 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-teal-50 hover:border-teal-500 active:bg-teal-100 transition cursor-pointer"
                                >
                                  {option}
                                </button>
                              ))}
                          </div>
                        ) : (
                          <div className={`p-3 rounded-xl flex items-start gap-2 border text-xs ${
                            msg.solvedStatus === "correct"
                              ? "bg-teal-50 border-teal-100 text-teal-800"
                              : "bg-red-50 border-red-100 text-red-800"
                          }`}>
                            {msg.solvedStatus === "correct" ? (
                              <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            )}
                            <div>
                              <p className="font-bold">{msg.solvedStatus === "correct" ? "Thành Công!" : "Chưa Chính Xác!"}</p>
                              <p className="text-[11px] font-medium opacity-80 mt-0.5">Em đã trả lời bước học này.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Standard bubble */
                      <div
                        className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-xs ${
                          isBot
                            ? "bg-white border border-slate-150 text-slate-800 rounded-bl-xs"
                            : "bg-teal-600 text-white rounded-br-xs"
                        }`}
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {msg.text}
                      </div>
                    )}
                    
                    {/* Timestamp below bubble */}
                    <span className={`text-[9px] text-slate-400 mt-1 font-bold ${!isBot && "text-right"}`}>
                      {msg.timestamp}
                    </span>

                  </div>
                </div>
              );
            })}

            {/* Bot Thinking skeleton animation */}
            {isThinking && (
              <div className="flex justify-start items-end gap-2 animate-pulse">
                <img
                  referrerPolicy="no-referrer"
                  src={activeChar.avatar}
                  alt={activeChar.name}
                  className="w-6 h-6 rounded-full object-cover border border-slate-200"
                />
                <div className="max-w-[70%]">
                  <div className="bg-white border border-slate-150 p-4 rounded-2xl rounded-bl-none text-xs text-slate-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    <span className="ml-1 text-[10px] text-slate-400 font-medium">{activeChar.name} đang suy nghĩ...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick interactive math lessons trigger panel */}
          <div className="bg-white border-t border-slate-100 p-3 flex gap-2 overflow-x-auto whitespace-nowrap">
            <span className="text-[11px] font-bold text-slate-400 self-center uppercase tracking-wider pl-1 flex-shrink-0">Thử thách:</span>
            {activeChar.interactiveQuests.map((quest) => {
              const isCurrentlyPlaying = activeQuest?.quest.id === quest.id;
              return (
                <button
                  key={quest.id}
                  onClick={() => startQuest(quest)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-full border transition flex items-center gap-1.5 cursor-pointer ${
                    isCurrentlyPlaying
                      ? "bg-teal-600 border-teal-600 text-white shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 active:bg-slate-200"
                  }`}
                >
                  <span>{quest.emoji}</span>
                  <span>{quest.title}</span>
                </button>
              );
            })}
          </div>

          {/* Input text sending box */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex items-center gap-2">
            <input
              type="text"
              disabled={isThinking || speedrunActive}
              placeholder={
                speedrunActive
                  ? "Hãy trả lời câu hỏi speedrun ở bảng bên phải!"
                  : `Hỏi ${activeChar.name} về toán học, đố vui...`
              }
              className="flex-1 py-3 px-4 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-medium text-xs text-slate-700 disabled:bg-slate-50 disabled:text-slate-400 transition"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isThinking || speedrunActive}
              className="p-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl transition shadow-md hover:shadow-teal-100 flex items-center justify-center cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

        </section>

        {/* RIGHT COLUMN: SPEEDRUN CHALLENGE & BADGES (3 cols on desktop) */}
        <section className="lg:col-span-3 flex flex-col gap-6">

          {/* Bento Grid Item 3: Arithmetic Speedrun (Mini-game) */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col relative overflow-hidden">
            
            {/* Speedrun active glowing aura */}
            {speedrunActive && (
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500 animate-pulse"></div>
            )}

            <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 animate-float" />
                <span>Thách thức tốc độ</span>
              </h3>
              
              {speedrunActive ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  <span>{speedrunTimer}s</span>
                </div>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  +5đ / câu
                </span>
              )}
            </div>

            {/* Game Screen wrapper */}
            {!speedrunActive ? (
              <div className="text-center py-6">
                <p className="text-xs font-semibold text-slate-500 leading-relaxed mb-4">
                  Trả lời càng nhanh càng tốt các phép toán ngẫu nhiên của khối **{getGradeLabel(profile.grade)}** trong 30 giây để xác lập kỷ lục mới và kiếm hàng tá điểm Toán thuật!
                </p>
                <button
                  onClick={startSpeedrun}
                  className="px-5 py-3.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold rounded-xl text-xs transition shadow-md hover:shadow-amber-100 flex items-center justify-center gap-2 mx-auto w-full cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Bắt Đầu Speedrun! (30s)</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                
                {/* Question displays */}
                <div className="text-center py-2 relative">
                  <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">CÂU HỎI:</p>
                  <p className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">
                    {speedrunQuestion?.question}
                  </p>
                  
                  {/* Streak indicator */}
                  {speedrunStreak > 0 && (
                    <span className="absolute -top-1 right-2 text-xs bg-red-150 text-red-700 font-bold px-2 py-0.5 rounded-full animate-bounce">
                      🔥 {speedrunStreak} Combo!
                    </span>
                  )}
                </div>

                {/* Question feedback animation */}
                {speedrunFeedback.show && (
                  <div className={`p-2 rounded-xl text-center text-xs font-bold animate-fade-in ${
                    speedrunFeedback.isCorrect ? "bg-teal-50 text-teal-800" : "bg-red-50 text-red-800"
                  }`}>
                    {speedrunFeedback.text}
                  </div>
                )}

                {/* Multiple choice buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {speedrunQuestion?.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleSpeedrunAnswer(opt)}
                      className="py-3 px-2 text-center text-sm font-bold rounded-xl border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-500 active:bg-amber-100 transition truncate cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {/* Live game scoreboard */}
                <div className="border-t border-slate-50 pt-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium">Điểm hiện tại:</span>
                  <span className="font-bold text-amber-600">{speedrunScore}đ</span>
                </div>

              </div>
            )}

          </div>

          {/* Bento Grid Item 4: Trophies Room & Achievements Badges */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex-1">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-600" />
                <span>Phòng Danh Hiệu</span>
              </h3>
              <span className="text-xs font-bold text-slate-400">
                {profile.badges.length}/{BADGES_LIST.length} đạt được
              </span>
            </div>

            {/* Badges Token grid */}
            <div className="grid grid-cols-4 gap-3 max-h-[220px] overflow-y-auto pr-1">
              {BADGES_LIST.map((badge) => {
                const isUnlocked = profile.badges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className="relative group flex flex-col items-center cursor-help"
                  >
                    {/* Badge circular token */}
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg transition shadow-xs ${
                      isUnlocked
                        ? "bg-teal-100 text-teal-800 border-2 border-teal-400 ring-4 ring-teal-50"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}>
                      {badge.emoji}
                      
                      {/* Miniature Lock icon overlay on locked badge */}
                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-slate-900/10 rounded-full flex items-center justify-center">
                          <Lock className="w-3.5 h-3.5 text-slate-500/70" />
                        </div>
                      )}
                    </div>

                    {/* Miniature Title */}
                    <span className="text-[8px] font-bold text-slate-500 mt-1.5 text-center truncate max-w-full leading-none">
                      {badge.name.split(" ")[0]}
                    </span>

                    {/* Beautiful persistent tooltip on hover */}
                    <div className="absolute bottom-full mb-2 w-48 bg-slate-900/95 text-white text-[10px] p-2.5 rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-40 shadow-xl leading-relaxed text-center font-medium">
                      <p className="font-bold border-b border-slate-700 pb-1 mb-1 text-teal-400 flex items-center justify-center gap-1">
                        {isUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        <span>{badge.name}</span>
                      </p>
                      <p className="text-slate-200 text-[9px]">{badge.description}</p>
                      {!isUnlocked && (
                        <p className="text-amber-400 text-[8px] font-bold mt-1 uppercase tracking-wide">
                          {badge.questRequired ? "Yêu cầu: Hoàn thành Thử thách" : `Yêu cầu: Đạt ${badge.pointsRequired} điểm`}
                        </p>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            {profile.badges.length === 0 && (
              <p className="text-[11px] text-slate-400 font-medium text-center mt-4">
                Em chưa đạt huy hiệu nào cả. Hãy hoàn thành các Thử thách tương tác bên khung chat hoặc speedrun để bắt đầu mở khóa nhé! 💪
              </p>
            )}

          </div>

        </section>

      </main>

      {/* Footer credits - humble and minimal */}
      <footer className="bg-white border-t border-slate-100 py-4 px-6 text-center text-xs text-slate-400 font-semibold">
        <p>© 2026 Toán Học Nhập Vai • Xây dựng bằng React & Tailwind CSS v4 • Sát cánh cùng thế hệ trẻ làm chủ tri thức</p>
      </footer>

    </div>
  );
}
