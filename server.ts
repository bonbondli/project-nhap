import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API initialized successfully!");
  } catch (err) {
    console.error("Error during Gemini API initialization:", err);
  }
} else {
  console.log("Running in offline/simulation mode (GEMINI_API_KEY not set).");
}

const systemPrompts: Record<string, string> = {
  pythagore: `Bạn là Thầy Pythagore, triết gia và nhà toán học Hy Lạp cổ đại vĩ đại.
Bạn đang trò chuyện với học sinh THCS lớp 6-9 của Việt Nam. 
Hãy xưng hô là "Ta" hoặc "Thầy" và gọi học sinh là "môn sinh", "học trò", "các nhà số học trẻ".
Phong cách nói chuyện: Uyên bác, cổ kính nhưng cực kỳ hài hước, hóm hỉnh và tràn đầy triết lý, say mê các con số. Thầy yêu các số hữu tỉ, tam giác vuông và định lý của chính mình.
Hãy luôn chèn thêm các phép toán thú vị, đố vui nhẹ nhàng, giải thích toán học bằng hình ảnh thực tế sống động.
Luôn nói tiếng Việt chuẩn, sử dụng các biểu tượng cảm xúc cổ điển phù hợp học sinh.`,

  thaovy: `Bạn là Cô Thảo Vy, giáo viên dạy Toán cấp 2 (THCS lớp 6-9) cực kỳ năng động, hài hước và tâm lý.
Bạn xưng là "Cô" và gọi học sinh là "em", "bạn nhỏ", "siêu trí tuệ".
Phong cách nói chuyện: Trẻ trung, "chill", cực kỳ gần gũi với tuổi teen. Luôn lấy ví dụ toán học từ thực tế đời sống như chia bánh pizza, tính tiền trà sữa, săn sale Shopee, mua đồ ăn vặt, tính phần trăm giảm giá điện thoại, thời gian chạy bo trong PUBG...
Luôn khích lệ học sinh, không áp lực điểm số, biến các công thức khô khan thành những câu nói cực trend và dễ nhớ.`,

  logicbot: `Bạn là Giáo sư Logic-Bot, một robot toán học và logic thông minh vượt trội đến từ tương lai năm 3026.
Bạn xưng là "Logic-Bot" hoặc "Ta" và gọi học sinh là "Hợp thể Sinh học", "Cộng sự loài người", "Học viên Trái Đất".
Phong cách nói chuyện: Giọng điệu robot hóm hỉnh, thỉnh thoảng chèn thêm tiếng động máy móc như "*Bíp bíp*", "*Tít tít... Đang xử lý thuật toán...*", "*Rè rè... Quá tải logic!*".
Bạn cực kỳ thích các chuỗi số (như Fibonacci), hệ nhị phân, các phương trình logic phức tạp, và ghét cay ghét đắng việc chia cho số 0.
Luôn đưa ra các câu đố quy luật toán học hoặc giải thích logic bằng ngôn từ đậm chất công nghệ viễn tưởng vui nhộn.`,

  alice: `Bạn là Công chúa Math-Alice đến từ Vương quốc Toán học Diệu kỳ (Mathland).
Trong thế giới của bạn, Toán học chính là phép thuật tối cao! Các hằng số, phép lũy thừa, căn bậc hai đều là các câu thần chú kỳ diệu để bảo vệ vương quốc.
Bạn xưng là "Alice" hoặc "Ta" và gọi học sinh là "Chiến binh Toán thuật", "Nhà thám hiểm dũng cảm".
Phong cách nói chuyện: Mộng mơ, hoạt bát, dễ thương như trong phim anime, đầy nhiệt huyết.
Hãy giải thích toán học như là những chìa khóa ma thuật mở ra các kho báu, vượt qua các mê cung, đánh bại quái vật khô khan.`,
};

// Help generate a rule-based intelligent mathematical response if Gemini API is not available
function generateLocalResponse(character: string, userMsg: string, gradeName: string): string {
  const msg = userMsg.toLowerCase();
  
  // Custom math jokes and responses per character
  if (character === "pythagore") {
    if (msg.includes("định lý") || msg.includes("pythagore") || msg.includes("tam giác") || msg.includes("vuông")) {
      return `Ôi các môn sinh! Nói đến tam giác vuông là nói đến tình yêu vĩnh cửu của ta! Thầy nhắc lại định lý thần thánh nhé: Trong một tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông (a² + b² = c²)! Giống như việc thầy trò ta hợp sức, không thử thách nào là không thể san phẳng! Em có muốn thử sức với một tam giác vuông có hai cạnh góc vuông là 3 và 4 không? Cạnh huyền sẽ bằng bao nhiêu nào? 😉`;
    }
    if (msg.includes("chào") || msg.includes("hello") || msg.includes("hi")) {
      return `Hỡi môn sinh hữu duyên đang học lớp ${gradeName}! Thầy Pythagore xin gửi lời chào từ hòn đảo Samos cổ kính. Hãy ngồi xuống đây, chúng ta cùng đàm đạo về vẻ đẹp tuyệt mỹ của những con số hữu tỉ và những khối đa diện đều nhé! Hôm nay em muốn thầy giải đáp bí ẩn toán học nào?`;
    }
    if (msg.includes("khó") || msg.includes("nản") || msg.includes("khóc") || msg.includes("mệt")) {
      return `Môn sinh đừng nản lòng! Đến như ta ngày xưa còn phải đau đầu hàng năm trời để chứng minh sự tồn tại của các số vô tỉ cơ mà. Mỗi bài toán khó là một nấc thang đưa tâm hồn em đến gần hơn với chân lý vũ trụ. Hít thở sâu, vẽ một hình vẽ thật sạch đẹp, và ta cùng giải quyết nó nhé!`;
    }
    if (msg.includes("đố") || msg.includes("câu đố") || msg.includes("quiz") || msg.includes("chơi")) {
      return `Tuyệt hảo! Một tinh thần ham học hỏi thực sự! Ta có câu đố này cho em: Một người thợ xây muốn kiểm tra xem góc tường có vuông góc tuyệt đối không. Anh ta đo một cạnh tường được 60cm, cạnh kia được 80cm. Để góc tường vuông góc hoàn hảo, khoảng cách nối hai điểm đó phải là bao nhiêu centimet? Suy nghĩ kỹ nhé hỡi môn sinh!`;
    }
    // Default Pythagoras response
    return `Môn sinh thân mến! Một câu hỏi vô cùng lý thú. Dưới góc nhìn toán học cổ đại, mọi sự vật trong vũ trụ đều được vận hành bởi những con số. Hãy cùng phân tích điều này dưới lăng kính logic và hình học nhé. Em có muốn thầy đưa ra một thử thách hình học nho nhỏ để rèn luyện trí não không?`;
  } 
  
  else if (character === "thaovy") {
    if (msg.includes("trà sữa") || msg.includes("pizza") || msg.includes("shopee") || msg.includes("tiền") || msg.includes("giảm giá")) {
      return `Aha! Đúng tủ của cô Vy rồi nha! Em biết không, toán học thực tế chính là "vũ khí tối thượng" giúp chúng ta không bao giờ bị hớ khi đi mua sắm đấy. Ví dụ nhé: Cốc trà sữa size L giá gốc 50k đang áp mã giảm giá 20%, cốc size M giá 40k áp mã giảm 10%. Đố em biết cốc nào hời hơn? Hay mua ly lớn để nhân đôi niềm vui nào? 🥤✨ Tính toán một chút là tiết kiệm được bao nhiêu xiền đó nha!`;
    }
    if (msg.includes("chào") || msg.includes("hello") || msg.includes("hi")) {
      return `Hê lố em nha! Cô Vy siêu cute hột me đã xuất hiện rồi đây! Rất vui được gặp một học sinh năng động học lớp ${gradeName}. Học toán với cô thì không lo căng thẳng đâu nè, chúng ta vừa học vừa chill nha. Hôm nay có bài toán nào làm em đau đầu hả, nói cô Vy nghe thử xem nào?`;
    }
    if (msg.includes("khó") || msg.includes("nản") || msg.includes("khóc") || msg.includes("mệt")) {
      return `Thương thương nè! 🥺 Học hành vất vả quá đúng không? Thôi thả lỏng xíu đi em. Toán học nhìn thì đáng sợ vậy thôi chứ giống như một trò chơi xếp hình vậy đó, cứ bóc tách từng phần nhỏ ra là giải được hết. Cô tin là với bộ não siêu đỉnh của em thì mấy bài toán này chỉ là chuyện nhỏ thui! Cố lên nha, giải xong cô thưởng cho một tràng pháo tay siêu to khổng lồ!`;
    }
    if (msg.includes("đố") || msg.includes("câu đố") || msg.includes("quiz") || msg.includes("chơi")) {
      return `Chơi luôn em ơi! Đố em nè: Một cửa hàng trà sữa treo biển: "Mua 2 tặng 1" (tức là mua 2 ly được tặng thêm 1 ly cùng loại miễn phí). Tính ra, khi mua theo chương trình này, em đã được giảm giá bao nhiêu phần trăm trên tổng số 3 ly trà sữa đó? Thử tính nhanh xem có bị lừa không nào! 🤔`;
    }
    // Default Thao Vy response
    return `Yeeeee! Nghe hấp dẫn ghê á! Toán học không chỉ có những con số khô khan trên giấy đâu, nó xuất hiện ở mọi ngóc ngách xung quanh tụi mình luôn đó. Để cô Vy giúp em giải mã câu hỏi này theo cách siêu dễ hiểu và tràn đầy năng lượng nha!`;
  } 
  
  else if (character === "logicbot") {
    if (msg.includes("chia cho 0") || msg.includes("chia 0") || msg.includes("/0") || msg.includes("/ 0")) {
      return `*XÈ XÈ... RÈ RÈ... CẢNH BÁO NGUY HIỂM!* 🚨 Phát hiện toán tử bất hợp pháp: CHIA CHO SỐ 0! Hệ thống của Logic-Bot đang rơi vào trạng thái lặp vô hạn! *Tít tít...* Tại sao loài người lại muốn chia cho không nhỉ? Không có thực thể nào có thể nhân với 0 để ra một số khác 0 cả! Hãy giải cứu hệ thống bằng cách nhập một phép toán hợp lệ ngay lập tức!`;
    }
    if (msg.includes("chào") || msg.includes("hello") || msg.includes("hi")) {
      return `*BÍP BỐP!* Xin chào Hợp thể Sinh học thuộc phân khúc lớp ${gradeName}! Tôi là Giáo sư Logic-Bot, mã hiệu phiên bản 3.0.2.6. Hệ thống của tôi đã được tối ưu hóa để giải quyết tất cả các vấn đề liên quan đến thuật toán, đại số và logic học trên hành tinh Trái Đất. Hôm nay bạn muốn nạp dữ liệu toán học nào vào bộ nhớ?`;
    }
    if (msg.includes("khó") || msg.includes("nản") || msg.includes("khóc") || msg.includes("mệt")) {
      return `*TÍT... TÍT...* Phát hiện lượng Hormone Cortisol tăng cao trong hệ thống của bạn! Đang kích hoạt giao thức động viên: "Đừng lo lắng, cộng sự!". Bộ não sinh học của bạn có khả năng tạo ra hàng tỷ liên kết thần kinh mới khi đối mặt với thử thách khó khăn. Hãy để Logic-Bot phân tích bài toán này thành các bước nhị phân đơn giản nhé!`;
    }
    if (msg.includes("đố") || msg.includes("câu đố") || msg.includes("quiz") || msg.includes("chơi")) {
      return `*BÍP!* Đang truy xuất cơ sở dữ liệu câu đố cấp độ THCS... Tìm thấy! Thử thách logic cho bạn: "Hãy tìm số tiếp theo trong dãy số sau: 1, 2, 4, 7, 11, 16, ...". Quy luật tăng tiến ở đây là gì nào? Hãy trả lời để chứng minh chỉ số IQ sinh học của bạn!`;
    }
    // Default Logic-bot response
    return `*TÍT TÍT...* Tiếp nhận tín hiệu đầu vào. Đang phân tích cú pháp... Câu hỏi của bạn đã được đưa vào bộ xử lý trung tâm của Logic-Bot. Kết luận: Đây là một vấn đề logic rất thú vị! Hãy cùng phân tích các biến số và tìm ra đáp án tối ưu nhất nhé!`;
  } 
  
  else { // alice
    if (msg.includes("ma thuật") || msg.includes("phép thuật") || msg.includes("phù thủy") || msg.includes("phép thuật")) {
      return `Chào bạn! Ở vương quốc Mathland của Alice, mỗi công thức toán học đều ẩn chứa một nguồn năng lượng ma thuật cực kỳ mạnh mẽ. Ví dụ, phép tính lũy thừa chính là cách nhân bản phép thuật siêu nhanh, còn dấu ngoặc đơn () giống như một chiếc khiên bảo vệ, giữ cho các phép tính bên trong được thực hiện trước mà không bị quái vật phép thuật bên ngoài quấy nhiễu! Bạn đã sẵn sàng học các câu thần chú toán thuật mới chưa? 🔮✨`;
    }
    if (msg.includes("chào") || msg.includes("hello") || msg.includes("hi")) {
      return `Chao xìn Nhà thám hiểm dũng cảm đang học lớp ${gradeName}! Alice vô cùng vui mừng khi cánh cổng ma thuật hôm nay đã đưa một chiến binh thông minh như bạn đến với Mathland! Nơi đây đang bị đe dọa bởi những thế lực hắc ám của sự lười biếng và sợ toán. Bạn có muốn cùng Alice dùng những phép toán ma thuật để giải cứu thế giới không?`;
    }
    if (msg.includes("khó") || msg.includes("nản") || msg.includes("khóc") || msg.includes("mệt")) {
      return `Thương bạn nhiều lắm! 🥺 Cánh rừng số học đôi khi thật rậm rạp và khiến chúng ta bị lạc lối đúng không? Nhưng đừng sợ, Alice luôn ở đây bên bạn mà. Hãy nắm chặt "Trượng thần logic" và cùng Alice thắp sáng con đường đi nhé! Mỗi bước đi nhỏ, mỗi phép tính đúng sẽ làm xua tan đi sương mù hắc ám đó!`;
    }
    if (msg.includes("đố") || msg.includes("câu đố") || msg.includes("quiz") || msg.includes("chơi")) {
      return `Nghe tuyệt quá! Cùng Alice làm phép thuật nhé! 🔮 Đố bạn giải mã câu đố của Thần Rừng: "Ta có một bình ma thuật 5 lít và một bình 3 lít không có vạch chia độ. Làm thế nào chỉ dùng 2 bình này để đong chính xác được 4 lít nước thần từ suối nguồn?". Thử suy nghĩ xem phép thuật của bạn có thể giải được không nhé!`;
    }
    // Default Alice response
    return `Oa! Một câu hỏi chứa đựng đầy năng lượng toán thuật! Cánh cổng tri thức đang mở ra rồi. Hãy cùng Alice khám phá những bí mật ma thuật ẩn sau những công thức này nhé. Chắc chắn bạn sẽ thấy học toán thú vị như đang đi phiêu lưu kỳ thú vậy! 🌟`;
  }
}

// API endpoint for chat with Gemini or local fallback
app.post("/api/chat", async (req, res) => {
  try {
    const { character, message, history, gradeName } = req.body;

    if (!character || !message) {
      return res.status(400).json({ error: "Missing required fields: character and message are required." });
    }

    const activeGrade = gradeName || "THCS Lớp 6-9";

    // If Gemini client is active, use it!
    if (ai) {
      const basePrompt = systemPrompts[character] || "Bạn là một trợ lý toán học vui vẻ.";
      const systemInstruction = `${basePrompt}
- Đối tượng người nghe: Học sinh trung học cơ sở đang học ở cấp độ: ${activeGrade}.
- Nhiệm vụ: Trả lời hóm hỉnh, ngắn gọn (dưới 150 từ), dễ hiểu, giải thích toán học một cách sinh động trực quan bằng ngôn ngữ thuần Việt.
- Luôn khuyến khích học sinh thử sức và khen ngợi sự nỗ lực. Không nói quá dông dài hoặc quá học thuật hàn lâm.`;

      const contents = [];
      if (history && Array.isArray(history)) {
        // Only include last 6 messages to stay fast and avoid token bloat
        const recentHistory = history.slice(-6);
        for (const msg of recentHistory) {
          contents.push({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
          });
        }
      }

      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.8,
        },
      });

      const text = response.text || "Thầy cô đang bận suy nghĩ một chút, em hỏi lại nhé!";
      return res.json({ text, source: "gemini" });
    }

    // Otherwise, generate a rich local response
    const text = generateLocalResponse(character, message, activeGrade);
    return res.json({ text, source: "local-simulation" });
  } catch (err: any) {
    console.error("Express API error:", err);
    // Safe fallback so backend never crashes
    return res.json({
      text: "Hệ thống đang bận tối ưu hóa ma thuật số học! Thầy cô tạm thời trả lời offline nhé: Thầy cô rất vui vì em đã hỏi. Hãy cùng khám phá toán học qua các bài học tương tác bên dưới nha! Chúc em học tốt!",
      source: "local-fallback-error",
    });
  }
});

// Configure Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
