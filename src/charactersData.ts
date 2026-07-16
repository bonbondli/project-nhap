import { Character } from "./types";

export const CHARACTERS: Character[] = [
  {
    id: "pythagore",
    name: "Thầy Pythagore",
    title: "Nhà toán học và triết gia Hy Lạp cổ đại",
    role: "Chuyên gia Hình học & Số luận cổ kính",
    avatar: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=200", // Representative elegant portrait
    emoji: "📐",
    accentColor: "teal-600",
    accentHex: "#0d9488",
    bgColor: "bg-teal-50/70",
    borderColor: "border-teal-100",
    greeting: "Chào mừng hỡi môn sinh hữu duyên! Ta là Pythagore, người đi tìm vẻ đẹp vĩnh hằng của vũ trụ thông qua những con số và khối đa diện. Thầy vô cùng hân hoan khi hôm nay được đồng hành cùng em học tập. Hãy cùng ta khám phá những định lý toán học thần thánh và rèn luyện tư duy sắc bén nhé!",
    specialties: ["Định lý Pythagore vĩ đại", "Các con số hữu tỉ hoàn hảo", "Tỉ lệ vàng trong kiến trúc", "Đố vui hình học"],
    interactiveQuests: [
      {
        id: "pythagore_q1",
        title: "Mật mã Tam Giác Vuông",
        description: "Thử thách vận dụng Định lý Pythagore thần thánh để tìm cạnh huyền huyền bí.",
        rewardPoints: 30,
        emoji: "🔺",
        steps: [
          {
            question: "Môn đồ thân mến! Một tam giác vuông cổ có hai cạnh góc vuông lần lượt dài 3 cm và 4 cm. Theo định lý của ta, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông. Hãy tính xem bình phương cạnh huyền bằng bao nhiêu?",
            options: ["12 cm²", "16 cm²", "25 cm²", "49 cm²"],
            correctAnswer: "25 cm²",
            explanation: "Chính xác! Ta lấy 3² + 4² = 9 + 16 = 25. Bình phương cạnh huyền là 25 cm²!",
            inputType: "choice"
          },
          {
            question: "Tuyệt vời! Vậy từ bình phương cạnh huyền là 25, em hãy rút căn bậc hai để tìm độ dài thực tế của cạnh huyền xem là bao nhiêu centimet?",
            options: ["5 cm", "6 cm", "7 cm", "8 cm"],
            correctAnswer: "5 cm",
            explanation: "Thật xuất sắc! Căn bậc hai của 25 chính là 5 (vì 5 x 5 = 25). Bộ ba số (3, 4, 5) là bộ ba số Pythagore huyền thoại đấy!",
            inputType: "choice"
          }
        ]
      },
      {
        id: "pythagore_q2",
        title: "Bí ẩn Số Hữu Tỉ",
        description: "Khám phá bản chất số học cổ đại và triết lý trường phái Pythagore.",
        rewardPoints: 20,
        emoji: "🔢",
        steps: [
          {
            question: "Trường phái Pythagore tin rằng mọi sự vật trong vũ trụ đều là các số hữu tỉ (có thể viết dưới dạng tỉ số a/b của hai số nguyên). Đố em, số nào sau đây KHÔNG PHẢI số hữu tỉ?",
            options: ["Số 0.75", "Số -5", "Phân số 2/3", "Số Pi (π)"],
            correctAnswer: "Số Pi (π)",
            explanation: "Chính xác! Số Pi (3.14159...) là số vô tỉ, không thể biểu diễn dưới dạng phân số của hai số nguyên. Ngày xưa, khi phát hiện ra số vô tỉ, học phái của ta đã vô cùng chấn động đấy!",
            inputType: "choice"
          }
        ]
      }
    ]
  },
  {
    id: "thaovy",
    name: "Cô Thảo Vy",
    title: "Giáo viên Toán cấp 2 siêu năng động",
    role: "Sứ giả Toán Học Đời Sống Thực Tế",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200", // Friendly photo
    emoji: "🍕",
    accentColor: "emerald-600",
    accentHex: "#059669",
    bgColor: "bg-emerald-50/70",
    borderColor: "border-emerald-100",
    greeting: "Yaaaas! Chào em nha! Cô là Thảo Vy, giáo viên dạy Toán siêu quậy đây. Đừng lo lắng chuyện công thức khô khan nhé, với cô Vy, toán học chính là chìa khóa để săn sale hời nhất, chia bánh pizza công bằng nhất và tính tiền trà sữa nhanh nhất hệ mặt trời luôn! Học toán siêu vui, cùng cô chiến đấu thôi nào! 🎉🥤",
    specialties: ["Mẹo tính nhẩm siêu tốc", "Săn Sale & Tính % chiết khấu", "Chia tỉ lệ đồ ăn vặt", "Tốc độ chạy xe học trễ"],
    interactiveQuests: [
      {
        id: "thaovy_q1",
        title: "Săn Sale Trà Sữa",
        description: "Giúp cô Vy tính toán chương trình khuyến mãi để mua trà sữa rẻ nhất cho lớp.",
        rewardPoints: 30,
        emoji: "🥤",
        steps: [
          {
            question: "Chào các siêu trí tuệ! Cô Vy đang muốn mua trà sữa trân châu cho cả nhóm học tập. Một ly có giá gốc là 40k, nhưng quán đang có chương trình giảm giá 15% khi thanh toán bằng ví điện tử. Đố em tính nhanh xem sau khi giảm 15%, một ly trà sữa có giá bao nhiêu?",
            options: ["32k", "34k", "35k", "36k"],
            correctAnswer: "34k",
            explanation: "Quá chuẩn! Giảm 15% nghĩa là giảm 40k x 0.15 = 6k. Vậy giá một ly chỉ còn 40k - 6k = 34k thôi! Tiết kiệm được một khoản rồi nè!",
            inputType: "choice"
          },
          {
            question: "Nếu cô Vy mang theo đúng 200k tiền mặt, với mức giá 34k một ly sau khi đã được giảm giá, đố em cô Vy có thể mua được tối đa bao nhiêu ly trà sữa cho cả lớp?",
            options: ["4 ly", "5 ly", "6 ly", "7 ly"],
            correctAnswer: "5 ly",
            explanation: "Đúng rồi! Ta có: 5 x 34k = 170k (vẫn dư 30k). Nếu mua 6 ly thì cần 6 x 34k = 204k (bị thiếu mất 4k mất rồi). Vậy tối đa mua được 5 ly nha!",
            inputType: "choice"
          }
        ]
      },
      {
        id: "thaovy_q2",
        title: "Chia Pizza Công Bằng",
        description: "Phép chia phân số thực tế giúp chia đều đồ ăn vặt cực hời.",
        rewardPoints: 25,
        emoji: "🍕",
        steps: [
          {
            question: "Cô Vy có 3 chiếc Pizza cỡ vừa giống hệt nhau, cô muốn chia đều 3 chiếc này cho 4 bạn học sinh giỏi của lớp. Đố em, mỗi bạn sẽ nhận được chính xác bao nhiêu phần của một chiếc Pizza?",
            options: ["1/4 chiếc", "1/2 chiếc", "3/4 chiếc", "2/3 chiếc"],
            correctAnswer: "3/4 chiếc",
            explanation: "Chuẩn không cần chỉnh! Ta thực hiện phép chia 3 chiếc Pizza cho 4 người, tức là phép chia số nguyên: 3 : 4 = 3/4 chiếc Pizza cho mỗi bạn!",
            inputType: "choice"
          }
        ]
      }
    ]
  },
  {
    id: "logicbot",
    name: "Giáo sư Logic-Bot",
    title: "Robot toán học thế kỷ 31",
    role: "Hệ thống phân tích Logic & Số học",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200", // Futuristic AI / Tech portrait
    emoji: "🤖",
    accentColor: "cyan-600",
    accentHex: "#0891b2",
    bgColor: "bg-cyan-50/70",
    borderColor: "border-cyan-100",
    greeting: "*BÍP BỐP... RÈ... KHỞI ĐỘNG HỆ THỐNG TOÁN THUẬT...* Chào Cộng sự loài người! Tôi là Giáo sư Logic-Bot, được gửi về từ năm 3026 để nâng cấp tư duy số học của bạn. Bộ vi xử lý của tôi chứa 100 Terabyte dữ liệu toán học THCS. Đang phát hiện chỉ số IQ toán học cao từ bạn. Hãy cùng nhau giải quyết các thuật toán búa bổ nhé! *Tít tít...*",
    specialties: ["Giải mã chuỗi số Fibonacci", "Ma trận logic nhị phân", "Khử lỗi chia cho số Không (0)", "Câu đố mật mã cổ điển"],
    interactiveQuests: [
      {
        id: "logicbot_q1",
        title: "Dãy Số Fibonacci Bí Ẩn",
        description: "Tìm quy luật ẩn giấu trong dãy số tăng trưởng tự nhiên huyền thoại.",
        rewardPoints: 35,
        emoji: "📈",
        steps: [
          {
            question: "*BÍP TÍT...* Hệ thống khóa của phòng thí nghiệm tương lai yêu cầu nhập mật mã là số tiếp theo trong chuỗi Fibonacci: 1, 1, 2, 3, 5, 8, 13... Bạn hãy phân tích quy luật và tìm ra số tiếp theo để giải cứu tôi!",
            options: ["18", "20", "21", "24"],
            correctAnswer: "21",
            explanation: "Xuất sắc! Quy luật của dãy Fibonacci là mỗi số tiếp theo bằng tổng của hai số đứng ngay trước nó: 8 + 13 = 21. Cổng phòng thí nghiệm đã mở!",
            inputType: "choice"
          },
          {
            question: "*TÍT BÍP!* Thừa thắng xông lên, sau số 21 sẽ là số tiếp theo nào trong chuỗi Fibonacci này hỡi cộng sự thông minh?",
            options: ["34", "30", "29", "35"],
            correctAnswer: "34",
            explanation: "Quá hoàn hảo! Số tiếp theo chính là 13 + 21 = 34. Bộ vi xử lý của tôi đánh giá trí tuệ của bạn ở mức 99.9%!",
            inputType: "choice"
          }
        ]
      },
      {
        id: "logicbot_q2",
        title: "Vùng Cấm: Chia cho Không (0)",
        description: "Khám phá quy tắc cơ bản cứu nguy hệ thống robot khỏi lỗi tràn bộ nhớ.",
        rewardPoints: 20,
        emoji: "🚨",
        steps: [
          {
            question: "*RE RÈ... CẢNH BÁO HỆ THỐNG!* Một chương trình độc hại gửi lệnh tính toán: x = 9999 / (5 - 5). Bộ xử lý của tôi đang bị treo vì phép toán chia cho 0! Đố bạn, tại sao trong toán học chúng ta tuyệt đối không thể chia một số cho số 0?",
            options: [
              "Vì kết quả sẽ luôn bằng 0",
              "Vì không có số nào nhân với 0 để bằng số bị chia khác 0",
              "Vì số 0 là số quá nhỏ",
              "Vì phép tính này chỉ làm được ở cấp 3"
            ],
            correctAnswer: "Vì không có số nào nhân với 0 để bằng số bị chia khác 0",
            explanation: "Chính xác! Phép chia là phép ngược của phép nhân. Nếu x = a / 0 thì x * 0 = a. Nhưng bất kỳ số nào nhân với 0 cũng đều bằng 0, nên nếu a khác 0 thì không thể tìm được x nào thỏa mãn! Cảm ơn bạn đã giải cứu hệ thống!",
            inputType: "choice"
          }
        ]
      }
    ]
  },
  {
    id: "alice",
    name: "Công chúa Alice",
    title: "Công chúa của Vương quốc Toán thuật Mathland",
    role: "Phù thủy Đại số & Thần chú Khai tâm",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", // Princess / cheerful avatar
    emoji: "🔮",
    accentColor: "purple-600",
    accentHex: "#9333ea",
    bgColor: "bg-purple-50/70",
    borderColor: "border-purple-100",
    greeting: "Chào mừng Nhà thám hiểm dũng cảm đã vượt qua ranh giới không gian để đến với vương quốc Mathland! Tớ là Alice. Ở thế giới này, toán học không phải là lý thuyết khô khan đâu, mà chính là những câu thần chú ma thuật đầy quyền năng đó! Hãy cùng tớ vung gậy phép, giải quyết những mật mã ẩn số x, y để mang lại ánh sáng cho vương quốc nhé! ✨🔮",
    specialties: ["Thần chú tìm ẩn số x", "Giải mật mã ma trận cổ đại", "Phép toán đong nước giải cứu rồng", "Vẽ sơ đồ tư duy ma thuật"],
    interactiveQuests: [
      {
        id: "alice_q1",
        title: "Ẩn Số Ma Thuật X",
        description: "Học cách giải quyết các phương trình đại số cơ bản như những câu thần chú phá giải xiềng xích.",
        rewardPoints: 30,
        emoji: "✨",
        steps: [
          {
            question: "Chiến binh ơi! Con quái vật lười biếng đã khóa rương báu bằng một ổ khóa đại số có mật mã là x thỏa mãn: 3x - 5 = 16. Em hãy làm phép toán chuyển vế đổi dấu để tìm x giải phong ấn xem nào!",
            options: ["x = 5", "x = 6", "x = 7", "x = 8"],
            correctAnswer: "x = 7",
            explanation: "Thần chú thành công! Ta chuyển -5 sang vế phải thành +5: 3x = 16 + 5 => 3x = 21. Chia cả hai vế cho 3 ta được x = 7. Rương báu đã mở!",
            inputType: "choice"
          },
          {
            question: "Tuyệt quá! Bên trong rương có một phong thư chứa một câu đố khác để bảo vệ vương miện: 2x + 10 = 4x. Hãy dùng phép thuật đại số thu gọn các số hạng chứa x để giải xem x bằng bao nhiêu nhé!",
            options: ["x = 2", "x = 5", "x = 10", "x = 4"],
            correctAnswer: "x = 5",
            explanation: "Quá xuất sắc! Ta chuyển 2x sang vế phải: 10 = 4x - 2x => 10 = 2x => x = 5. Vương miện Mathland đã được bảo vệ an toàn!",
            inputType: "choice"
          }
        ]
      },
      {
        id: "alice_q2",
        title: "Bí Ẩn Đong Nước Suối Thần",
        description: "Sử dụng tư duy thuật toán đong nước kinh điển để cứu khu rừng ma thuật.",
        rewardPoints: 30,
        emoji: "🧪",
        steps: [
          {
            question: "Khu rừng ma thuật đang bị bốc hỏa, Thần Rừng nói chúng ta cần chính xác 4 lít nước suối để dập tắt lửa. Nhưng chúng ta chỉ có hai chiếc xô rỗng: xô 5 Lít và xô 3 Lít (không có vạch chia độ). Đầu tiên, Alice múc đầy xô 5 lít, sau đó đổ đầy nước từ xô 5 lít sang xô 3 lít rỗng. Đố bạn lúc này xô 5 lít còn lại bao nhiêu lít nước?",
            options: ["1 lít", "2 lít", "3 lít", "0 lít"],
            correctAnswer: "2 lít",
            explanation: "Chính xác! Đổ đầy xô 3 lít thì xô 5 lít đã sụt đi đúng 3 lít nước, nên còn dư lại chính xác 5 - 3 = 2 lít nước!",
            inputType: "choice"
          },
          {
            question: "Bước tiếp theo: Alice đổ hết nước trong xô 3 lít đi, rồi đổ 2 lít nước còn lại từ xô 5 lít sang xô 3 lít đó. Lúc này xô 3 lít đang chứa 2 lít nước (còn trống 1 lít nữa mới đầy). Cuối cùng, Alice múc đầy lại xô 5 lít nước, và rót nước từ xô 5 lít đầy đó sang cho đầy xô 3 lít đang chứa 2 lít kia. Đố bạn, lúc này trong xô 5 lít còn lại đúng bao nhiêu lít nước?",
            options: ["2 lít", "3 lít", "4 lít", "5 lít"],
            correctAnswer: "4 lít",
            explanation: "Ôi phép thuật toán học diệu kỳ! Xô 3 lít đã chứa 2 lít nên chỉ cần thêm đúng 1 lít nữa là đầy. Khi rót đầy xô 3 lít, xô 5 lít đang đầy sẽ mất đi đúng 1 lít nước, để lại chính xác: 5 - 1 = 4 lít nước suối thần kỳ! Chúng ta đã cứu được khu rừng rồi! 🌳🔥💧",
            inputType: "choice"
          }
        ]
      }
    ]
  }
];

export const BADGES_LIST = [
  {
    id: "badge_pythagore",
    name: "Môn Sinh Pythagore",
    description: "Hoàn thành một thử thách hình học cổ đại với Thầy Pythagore.",
    emoji: "📐",
    questRequired: "pythagore_q1"
  },
  {
    id: "badge_thaovy",
    name: "Siêu Trí Tuệ Săn Sale",
    description: "Giải bài toán trà sữa thực tế cùng cô Thảo Vy thành công.",
    emoji: "🍕",
    questRequired: "thaovy_q1"
  },
  {
    id: "badge_logicbot",
    name: "Cộng Sự Robot",
    description: "Giải cứu vi xử lý Logic-Bot khỏi câu đố dãy số Fibonacci.",
    emoji: "🤖",
    questRequired: "logicbot_q1"
  },
  {
    id: "badge_alice",
    name: "Chiến Binh Toán Thuật",
    description: "Vượt qua thử thách ẩn số ma thuật cùng Công chúa Alice.",
    emoji: "🔮",
    questRequired: "alice_q1"
  },
  {
    id: "badge_first_level",
    name: "Nhà Toán Học Tập Sự",
    description: "Đạt mốc tích lũy 50 điểm Toán thuật.",
    emoji: "🎓",
    pointsRequired: 50
  },
  {
    id: "badge_speedrun",
    name: "Chiến Thần Tốc Độ",
    description: "Đạt điểm số cao trong Thử thách Tốc độ Toán học.",
    emoji: "⚡",
    pointsRequired: 100
  },
  {
    id: "badge_master",
    name: "Đại Hiệp Sĩ Số Học",
    description: "Đạt mốc tích lũy 150 điểm Toán thuật.",
    emoji: "👑",
    pointsRequired: 150
  }
];

// Random cute Vietnamese math riddles for general chatbot chat fallback
export const MATH_RIDDLES_VI = [
  {
    question: "Có 1 đàn chim đậu trên cành. Người thợ săn bắn 'pằng' một phát chết 1 con chim. Hỏi trên cành còn lại mấy con chim?",
    options: ["Còn 0 con (những con khác bay mất)", "Còn 9 con", "Còn 1 con", "Còn 5 con"],
    answer: "Còn 0 con (những con khác bay mất)",
    explanation: "Đúng rồi! Khi nghe tiếng súng nổ, tất cả những con chim khác sợ hãi bay đi mất, chỉ còn lại con bị bắn chết rơi xuống đất thôi!"
  },
  {
    question: "Nếu có 3 quả táo và bạn lấy đi 2 quả, hỏi bạn có bao nhiêu quả táo?",
    options: ["1 quả", "2 quả", "3 quả", "0 quả"],
    answer: "2 quả",
    explanation: "Đúng thế! Bạn lấy đi 2 quả táo thì chính bạn đang cầm 2 quả táo đó trên tay chứ đâu!"
  },
  {
    question: "Một cây tre cao 9 mét. Mỗi ngày một chú ốc sên leo lên được 3 mét, nhưng đêm đến lại bị tụt xuống 2 mét. Hỏi sau bao nhiêu ngày đêm chú ốc sên sẽ leo lên đến đỉnh cây tre?",
    options: ["9 ngày 8 đêm", "7 ngày 6 đêm", "8 ngày 7 đêm", "6 ngày 5 đêm"],
    answer: "7 ngày 6 đêm",
    explanation: "Tuyệt vời! Sau 6 ngày đêm, chú ốc sên leo được: 6 x (3 - 2) = 6 mét. Đến ngày thứ 7, chú leo tiếp 3 mét: 6 + 3 = 9 mét và đạt đỉnh ngay lập tức mà không bị tụt nữa!"
  }
];
