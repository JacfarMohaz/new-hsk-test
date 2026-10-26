export interface ExamSentence {
  lessonId: number;
  answerHanzi: string;
  /** Sentence with the answer word replaced by "____". */
  sentence: string;
  english: string;
  /**
   * Present only on sentences usable for the sentence-ordering section.
   * The full sentence (blank already filled in) split into tappable chunks;
   * joining them in order reproduces the sentence exactly.
   */
  tokens?: string[];
}

export const EXAM_SENTENCES: ExamSentence[] = [
  // Lesson 1
  { lessonId: 1, answerHanzi: "周末", sentence: "____我喜欢在家看书。", english: "On weekends, I like to read at home.", tokens: ["周末", "我", "喜欢", "在家", "看书。"] },
  { lessonId: 1, answerHanzi: "打算", sentence: "你周末____做什么？", english: "What do you plan to do this weekend?" },
  { lessonId: 1, answerHanzi: "复习", sentence: "考试前，我们要____生词。", english: "Before the exam, we need to review the new words." },
  { lessonId: 1, answerHanzi: "地图", sentence: "我没有____，不知道怎么走。", english: "I don't have a map, I don't know how to get there." },
  { lessonId: 1, answerHanzi: "面包", sentence: "早上我吃了一个____。", english: "I ate a piece of bread this morning." },

  // Lesson 2
  { lessonId: 2, answerHanzi: "腿", sentence: "他____很疼，不能爬山。", english: "His legs hurt a lot, he can't climb the mountain.", tokens: ["他", "腿很疼，", "不能", "爬山。"] },
  { lessonId: 2, answerHanzi: "容易", sentence: "这个问题很____，我一下就懂了。", english: "This question is very easy, I understood it right away." },
  { lessonId: 2, answerHanzi: "难", sentence: "汉语的声调对我来说很____。", english: "Chinese tones are very difficult for me." },
  { lessonId: 2, answerHanzi: "办公室", sentence: "经理现在在____里开会。", english: "The manager is having a meeting in the office now." },
  { lessonId: 2, answerHanzi: "伞", sentence: "外面下雨了，你带____了吗？", english: "It's raining outside, did you bring an umbrella?" },

  // Lesson 3
  { lessonId: 3, answerHanzi: "爬山", sentence: "周末我们一起去____，好吗？", english: "Let's go hiking together this weekend, okay?", tokens: ["周末", "我们", "一起去", "爬山，", "好吗？"] },
  { lessonId: 3, answerHanzi: "新鲜", sentence: "这些水果很____，你可以买。", english: "This fruit is very fresh, you can buy it." },
  { lessonId: 3, answerHanzi: "甜", sentence: "这个蛋糕太____了，我不喜欢。", english: "This cake is too sweet, I don't like it." },
  { lessonId: 3, answerHanzi: "饮料", sentence: "桌子上放着很多____。", english: "There are many drinks on the table." },
  { lessonId: 3, answerHanzi: "舒服", sentence: "这把椅子坐着很____。", english: "This chair is very comfortable to sit in." },

  // Lesson 4
  { lessonId: 4, answerHanzi: "比赛", sentence: "明天有一场重要的____。", english: "There's an important match tomorrow.", tokens: ["明天", "有", "一场", "重要的", "比赛。"] },
  { lessonId: 4, answerHanzi: "照片", sentence: "这张____是在北京照的。", english: "This photo was taken in Beijing." },
  { lessonId: 4, answerHanzi: "聪明", sentence: "这个孩子很____，学得很快。", english: "This child is very clever, learns very fast." },
  { lessonId: 4, answerHanzi: "超市", sentence: "我要去____买点儿东西。", english: "I need to go to the supermarket to buy some things." },
  { lessonId: 4, answerHanzi: "客人", sentence: "她总是笑着跟____说话。", english: "She always talks to customers with a smile." },

  // Lesson 5
  { lessonId: 5, answerHanzi: "发烧", sentence: "他____了，不能去上课。", english: "He has a fever, he can't go to class.", tokens: ["他", "发烧了，", "不能", "去上课。"] },
  { lessonId: 5, answerHanzi: "感冒", sentence: "天气变冷了，很多人都____了。", english: "The weather turned cold, many people caught a cold." },
  { lessonId: 5, answerHanzi: "季节", sentence: "春天是我最喜欢的____。", english: "Spring is my favorite season." },
  { lessonId: 5, answerHanzi: "裙子", sentence: "这条____很漂亮，多少钱？", english: "This dress is very pretty, how much is it?" },
  { lessonId: 5, answerHanzi: "最近", sentence: "我____越来越胖了。", english: "I've been getting fatter and fatter lately." },

  // Lesson 6
  { lessonId: 6, answerHanzi: "眼镜", sentence: "我看不清楚，忘了带____。", english: "I can't see clearly, I forgot to bring my glasses.", tokens: ["我", "看不清楚，", "忘了", "带眼镜。"] },
  { lessonId: 6, answerHanzi: "突然", sentence: "他____不说话了。", english: "He suddenly stopped talking." },
  { lessonId: 6, answerHanzi: "公园", sentence: "晚上我们常去____散步。", english: "In the evening we often go for a walk in the park." },
  { lessonId: 6, answerHanzi: "音乐", sentence: "我喜欢听中国____。", english: "I like listening to Chinese music." },
  { lessonId: 6, answerHanzi: "锻炼", sentence: "每天早上他都去____身体。", english: "Every morning he goes to exercise." },

  // Lesson 7
  { lessonId: 7, answerHanzi: "同事", sentence: "他是我的____，我们一起工作。", english: "He is my colleague, we work together.", tokens: ["他是", "我的同事，", "我们", "一起工作。"] },
  { lessonId: 7, answerHanzi: "银行", sentence: "我要去____换钱。", english: "I need to go to the bank to exchange money." },
  { lessonId: 7, answerHanzi: "结婚", sentence: "他们打算明年____。", english: "They plan to get married next year." },
  { lessonId: 7, answerHanzi: "迟到", sentence: "今天路上车很多，我____了。", english: "There was a lot of traffic today, I was late." },
  { lessonId: 7, answerHanzi: "接", sentence: "我去机场____你。", english: "I'll go to the airport to pick you up." },

  // Lesson 8
  { lessonId: 8, answerHanzi: "熊猫", sentence: "中国的____非常可爱。", english: "China's pandas are very cute.", tokens: ["中国的", "熊猫", "非常", "可爱。"] },
  { lessonId: 8, answerHanzi: "电梯", sentence: "这栋楼没有____，要走楼梯。", english: "This building has no elevator, you have to take the stairs." },
  { lessonId: 8, answerHanzi: "害怕", sentence: "我很____黑，不敢一个人睡觉。", english: "I'm very afraid of the dark, I don't dare sleep alone." },
  { lessonId: 8, answerHanzi: "健康", sentence: "他每天锻炼，身体很____。", english: "He exercises every day, his body is very healthy." },
  { lessonId: 8, answerHanzi: "重要", sentence: "这件事情很____，你一定要记得。", english: "This matter is very important, you must remember it." },

  // Lesson 9
  { lessonId: 9, answerHanzi: "一样", sentence: "她的汉语说得跟中国人____好。", english: "She speaks Chinese as well as a Chinese person.", tokens: ["她的汉语", "说得", "跟中国人", "一样好。"] },
  { lessonId: 9, answerHanzi: "放心", sentence: "别担心，你____吧。", english: "Don't worry, just relax." },
  { lessonId: 9, answerHanzi: "担心", sentence: "妈妈很____我的身体。", english: "Mom worries a lot about my health." },
  { lessonId: 9, answerHanzi: "参加", sentence: "我打算____这次比赛。", english: "I plan to participate in this competition." },
  { lessonId: 9, answerHanzi: "了解", sentence: "我不太____这个地方的文化。", english: "I don't know this place's culture very well." },

  // Lesson 10
  { lessonId: 10, answerHanzi: "数学", sentence: "____比历史难多了。", english: "Math is much harder than history.", tokens: ["数学", "比", "历史", "难多了。"] },
  { lessonId: 10, answerHanzi: "历史", sentence: "我对中国____很感兴趣。", english: "I'm very interested in Chinese history." },
  { lessonId: 10, answerHanzi: "自行车", sentence: "他每天骑____去上班。", english: "He rides a bicycle to work every day." },
  { lessonId: 10, answerHanzi: "方便", sentence: "坐地铁去机场很____。", english: "Taking the subway to the airport is very convenient." },
  { lessonId: 10, answerHanzi: "附近", sentence: "我家____有一个公园。", english: "There's a park near my home." },

  // Lesson 11
  { lessonId: 11, answerHanzi: "图书馆", sentence: "我在____借了几本书。", english: "I borrowed a few books from the library.", tokens: ["我", "在图书馆", "借了", "几本书。"] },
  { lessonId: 11, answerHanzi: "词典", sentence: "这个词是什么意思？你查一下____。", english: "What does this word mean? Check the dictionary." },
  { lessonId: 11, answerHanzi: "空调", sentence: "别忘了把____关了。", english: "Don't forget to turn off the air conditioner." },
  { lessonId: 11, answerHanzi: "地铁", sentence: "我们坐____去学校吧。", english: "Let's take the subway to school." },
  { lessonId: 11, answerHanzi: "习惯", sentence: "我已经____这里的生活了。", english: "I'm already used to life here." },

  // Lesson 12
  { lessonId: 12, answerHanzi: "护照", sentence: "出国旅行一定要带____。", english: "You must bring your passport when traveling abroad.", tokens: ["出国旅行", "一定", "要带", "护照。"] },
  { lessonId: 12, answerHanzi: "行李箱", sentence: "把重要的东西放在我的____里吧。", english: "Put the important things in my suitcase." },
  { lessonId: 12, answerHanzi: "自己", sentence: "这件事我想____做。", english: "I want to do this myself." },
  { lessonId: 12, answerHanzi: "发现", sentence: "我____这本书很有意思。", english: "I discovered that this book is very interesting." },
  { lessonId: 12, answerHanzi: "需要", sentence: "你____多少钱？", english: "How much money do you need?" },

  // Lesson 13
  { lessonId: 13, answerHanzi: "礼物", sentence: "这是我送给你的____。", english: "This is the gift I'm giving you.", tokens: ["这是", "我送给你的", "礼物。"] },
  { lessonId: 13, answerHanzi: "终于", sentence: "我们____到家了。", english: "We finally got home." },
  { lessonId: 13, answerHanzi: "经常", sentence: "他____去图书馆看书。", english: "He often goes to the library to read." },
  { lessonId: 13, answerHanzi: "应该", sentence: "你____多喝水。", english: "You should drink more water." },
  { lessonId: 13, answerHanzi: "生活", sentence: "这里的____很方便。", english: "Life here is very convenient." },

  // Lesson 14
  { lessonId: 14, answerHanzi: "冰箱", sentence: "水果都在____里。", english: "The fruit is all in the refrigerator.", tokens: ["水果", "都在", "冰箱里。"] },
  { lessonId: 14, answerHanzi: "打扫", sentence: "我周末要____房间。", english: "I need to clean my room this weekend." },
  { lessonId: 14, answerHanzi: "香蕉", sentence: "你把____拿过来吧。", english: "Bring the bananas over." },
  { lessonId: 14, answerHanzi: "菜单", sentence: "服务员，请给我看一下____。", english: "Waiter, please let me see the menu." },
  { lessonId: 14, answerHanzi: "简单", sentence: "这道题很____，我一看就会。", english: "This question is very simple, I understood it at a glance." },

  // Lesson 15
  { lessonId: 15, answerHanzi: "留学", sentence: "他打算去美国____。", english: "He plans to study abroad in America.", tokens: ["他", "打算", "去美国", "留学。"] },
  { lessonId: 15, answerHanzi: "练习", sentence: "多做____，你的汉语会更好。", english: "Do more exercises, your Chinese will get better." },
  { lessonId: 15, answerHanzi: "新闻", sentence: "我每天都看____。", english: "I watch the news every day." },
  { lessonId: 15, answerHanzi: "其他", sentence: "____都没什么问题。", english: "Everything else is no problem." },
  { lessonId: 15, answerHanzi: "文化", sentence: "我对中国____很感兴趣。", english: "I'm very interested in Chinese culture." },

  // Lesson 16
  { lessonId: 16, answerHanzi: "城市", sentence: "北京是一个很大的____。", english: "Beijing is a very big city.", tokens: ["北京", "是", "一个很大的", "城市。"] },
  { lessonId: 16, answerHanzi: "如果", sentence: "____明天下雨，我们就不去了。", english: "If it rains tomorrow, we won't go." },
  { lessonId: 16, answerHanzi: "可爱", sentence: "这只小狗真____。", english: "This little dog is really cute." },
  { lessonId: 16, answerHanzi: "头发", sentence: "她的____很长。", english: "Her hair is very long." },
  { lessonId: 16, answerHanzi: "检查", sentence: "医生给他____了身体。", english: "The doctor gave him a physical examination." },

  // Lesson 17
  { lessonId: 17, answerHanzi: "请假", sentence: "我今天身体不舒服，想____。", english: "I'm not feeling well today, I want to ask for leave.", tokens: ["我今天", "身体不舒服，", "想", "请假。"] },
  { lessonId: 17, answerHanzi: "爱好", sentence: "我的____是听音乐。", english: "My hobby is listening to music." },
  { lessonId: 17, answerHanzi: "决定", sentence: "我已经____去北京工作了。", english: "I've decided to go work in Beijing." },
  { lessonId: 17, answerHanzi: "渴", sentence: "我很____，想喝水。", english: "I'm very thirsty, I want to drink water." },
  { lessonId: 17, answerHanzi: "办法", sentence: "谁都有____看好你的病。", english: "Everyone has a way to cure your illness." },

  // Lesson 18
  { lessonId: 18, answerHanzi: "相信", sentence: "我____他们会同意的。", english: "I believe they will agree.", tokens: ["我", "相信", "他们会", "同意的。"] },
  { lessonId: 18, answerHanzi: "同意", sentence: "大家都____这个办法。", english: "Everyone agrees with this method." },
  { lessonId: 18, answerHanzi: "机会", sentence: "这是一个很好的____。", english: "This is a very good opportunity." },
  { lessonId: 18, answerHanzi: "有名", sentence: "这家饭店很____。", english: "This restaurant is very famous." },
  { lessonId: 18, answerHanzi: "奇怪", sentence: "他今天的样子很____。", english: "The way he looks today is very strange." },

  // Lesson 19
  { lessonId: 19, answerHanzi: "脸", sentence: "她的____红了。", english: "Her face turned red.", tokens: ["她的", "脸", "红了。"] },
  { lessonId: 19, answerHanzi: "短", sentence: "这条裤子有点儿____。", english: "These pants are a bit short." },
  { lessonId: 19, answerHanzi: "鸟", sentence: "树上有很多____。", english: "There are many birds in the tree." },
  { lessonId: 19, answerHanzi: "哭", sentence: "小孩子为什么____了？", english: "Why is the child crying?" },
  { lessonId: 19, answerHanzi: "船", sentence: "我们坐____去那个岛。", english: "We took a boat to that island." },

  // Lesson 20
  { lessonId: 20, answerHanzi: "难过", sentence: "听到这个消息，她很____。", english: "Hearing this news, she was very sad.", tokens: ["听到这个消息，", "她", "很", "难过。"] },
  { lessonId: 20, answerHanzi: "信用卡", sentence: "我可以用____付钱吗？", english: "Can I pay with a credit card?" },
  { lessonId: 20, answerHanzi: "成绩", sentence: "他这次考试的____很好。", english: "His exam results this time were very good." },
  { lessonId: 20, answerHanzi: "解决", sentence: "这个问题很容易____。", english: "This problem is easy to solve." },
  { lessonId: 20, answerHanzi: "试", sentence: "你可以____一下这件衣服。", english: "You can try on this piece of clothing." },
];

export function getOrderableSentences(): (ExamSentence & { tokens: string[] })[] {
  return EXAM_SENTENCES.filter((s): s is ExamSentence & { tokens: string[] } => !!s.tokens);
}

export function getSentencesByLesson(lessonId: number): ExamSentence[] {
  return EXAM_SENTENCES.filter((s) => s.lessonId === lessonId);
}
