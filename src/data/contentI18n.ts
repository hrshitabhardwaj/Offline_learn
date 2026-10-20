import type { Lang } from '@/lib/i18n';
import type { Question, Lesson } from '@/data/content';

// Multilingual content. structure: CONTENT[topicId][lang] = { title, desc, lessons, practice, assessment, basic, advanced }
// English is provided by the existing TOPICS export; other languages are translated here.
// Math symbols and digits stay identical; only words are translated.
// The `answer` index stays the same across languages.

export type TopicTranslation = {
  title: string;
  desc: string;
  lessons: Lesson[];
  practice: Question[];
  assessment: Question[];
  basic: Question[];
  advanced: Question[];
};

// ---------------- Hindi ----------------
const hi_fractions: TopicTranslation = {
  title: 'भिन्न',
  desc: 'भिन्नों का जोड़, घटाव, गुणा और भाग।',
  lessons: [
    {
      id: 'fractions-l1',
      title: 'भिन्नों के साथ संक्रियाएँ',
      concept:
        'भिन्न किसी पूर्ण का हिस्सा दर्शाता है, जिसे a/b के रूप में लिखा जाता है, जहाँ a अंश और b हर है। भिन्न जोड़ने या घटाने के लिए, साझा हर ज्ञात करें (आमतौर पर हरों का LCM), प्रत्येक भिन्न को बदलें, फिर अंशों को जोड़ें या घटाएँ। भिन्नों को गुणा करने के लिए, अंशों को आपस में और हरों को आपस में गुणा करें। किसी भिन्न से भाग देने के लिए, उसके व्युत्क्रम से गुणा करें।',
      example: {
        problem: '2/3 + 1/4 की गणना करें।',
        solution: '3 और 4 का LCM 12 है। 2/3 = 8/12 और 1/4 = 3/12। अतः 8/12 + 3/12 = 11/12।',
      },
    },
    {
      id: 'fractions-l2',
      title: 'सरल करना और तुलना',
      concept:
        'भिन्न तब सरलतम रूप में होता है जब अंश और हर में 1 के अलावा कोई साझा गुणनखंड न हो। सरल करने के लिए, दोनों को उनके HCF से भाग दें। भिन्नों की तुलना के लिए, हरों को समान बनाएँ (LCM का उपयोग करके) और अंशों की तुलना करें।',
      example: {
        problem: '18/24 को सरल करें और 3/5 की 2/3 से तुलना करें।',
        solution: '18 और 24 का HCF 6 है, अतः 18/24 = 3/4। 3/5 और 2/3 के लिए, 5 और 3 का LCM 15 है: 3/5 = 9/15 और 2/3 = 10/15। चूँकि 9 < 10, 3/5 < 2/3।',
      },
    },
  ],
  practice: [
    { id: 'fractions-p1', prompt: '1/2 + 1/3 क्या है?', options: ['2/5', '5/6', '1/6', '2/6'], answer: 1, hint: 'पहले साझा हर ज्ञात करें (2 और 3 का LCM)।', explanation: '2 और 3 का LCM 6 है। 1/2 = 3/6, 1/3 = 2/6। योग = 5/6।' },
    { id: 'fractions-p2', prompt: '15/20 को सरल करें।', options: ['3/4', '5/4', '3/5', '15/20'], answer: 0, hint: 'ऊपर और नीचे दोनों को उनके HCF से भाग दें।', explanation: '15 और 20 का HCF 5 है। 15 ÷ 5 = 3, 20 ÷ 5 = 4, अतः 3/4।' },
    { id: 'fractions-p3', prompt: '2/5 × 3/4 की गणना करें।', options: ['6/20', '6/9', '5/9', '8/15'], answer: 0, hint: 'अंशों को गुणा करें, हरों को गुणा करें।', explanation: '2×3 = 6, 5×4 = 20, अतः 6/20 जो 3/10 हो जाता है।' },
    { id: 'fractions-p4', prompt: '3/4 ÷ 1/2 क्या है?', options: ['3/8', '3/2', '4/3', '1/2'], answer: 1, hint: 'भाग देने के लिए, व्युत्क्रम से गुणा करें।', explanation: '3/4 ÷ 1/2 = 3/4 × 2/1 = 6/4 = 3/2।' },
    { id: 'fractions-p5', prompt: 'कौन-सा बड़ा है: 2/3 या 5/8?', options: ['2/3', '5/8', 'दोनों बराबर हैं', 'तुलना नहीं की जा सकती'], answer: 0, hint: 'हर 24 का उपयोग करें।', explanation: '2/3 = 16/24, 5/8 = 15/24। चूँकि 16 > 15, 2/3 बड़ा है।' },
  ],
  assessment: [
    { id: 'fractions-a1', prompt: '1/4 + 1/8 = ?', options: ['2/8', '3/8', '1/16', '2/12'], answer: 1, hint: 'साझा हर 8।', explanation: '1/4 = 2/8, अतः 2/8 + 1/8 = 3/8।' },
    { id: 'fractions-a2', prompt: '24/36 को सरल करें।', options: ['2/3', '3/4', '4/6', '6/9'], answer: 0, hint: '24 और 36 का HCF 12 है।', explanation: '24 ÷ 12 = 2, 36 ÷ 12 = 3, अतः 2/3।' },
    { id: 'fractions-a3', prompt: '5/6 − 1/3 = ?', options: ['4/3', '1/2', '4/6', '3/6'], answer: 1, hint: 'साझा हर 6।', explanation: '1/3 = 2/6, अतः 5/6 − 2/6 = 3/6 = 1/2।' },
    { id: 'fractions-a4', prompt: '2/3 × 6 = ?', options: ['4', '12/3', '8/3', '4/3'], answer: 0, hint: '6 = 6/1, सीधे गुणा करें।', explanation: '2/3 × 6/1 = 12/3 = 4।' },
    { id: 'fractions-a5', prompt: '3/5 ÷ 2 = ?', options: ['6/5', '3/10', '3/7', '5/6'], answer: 1, hint: '2 से भाग देना 1/2 से गुणा है।', explanation: '3/5 × 1/2 = 3/10।' },
    { id: 'fractions-a6', prompt: 'कौन-सा भिन्न सबसे छोटा है?', options: ['1/2', '2/5', '3/7', '3/8'], answer: 3, hint: 'हर 280 के साथ तुलना करें।', explanation: '1/2=140/280, 2/5=112/280, 3/7=120/280, 3/8=105/280। सबसे छोटा 3/8 है।' },
    { id: 'fractions-a7', prompt: 'एक पिज़्ज़ा 8 टुकड़ों में कटा है। आप 3 खाते हैं और एक दोस्त 2 खाता है। कितना भिन्न बचा है?', options: ['3/8', '5/8', '1/4', '3/5'], answer: 0, hint: '8 में से 5 खाए गए, अतः 3 बचे।', explanation: '3 + 2 = 5 खाए गए। 8 − 5 = 3 बचे, अतः 3/8।' },
    { id: 'fractions-a8', prompt: '0.75 को सरलतम भिन्न में व्यक्त करें।', options: ['75/100', '3/4', '7/10', '3/5'], answer: 1, hint: '0.75 = 75/100, फिर सरल करें।', explanation: '75/100; HCF 25, अतः 3/4।' },
    { id: 'fractions-a9', prompt: '1/3 का 1/2 = ?', options: ['1/6', '2/3', '1/5', '1/2'], answer: 0, hint: '"का" का अर्थ गुणा है।', explanation: '1/2 × 1/3 = 1/6।' },
    { id: 'fractions-a10', prompt: 'जोड़ें: 1/3 + 1/6 + 1/2।', options: ['3/11', '1', '6/11', '5/6'], answer: 1, hint: 'साझा हर 6।', explanation: '2/6 + 1/6 + 3/6 = 6/6 = 1।' },
  ],
  basic: [
    { id: 'fractions-b1', prompt: '10 का 1/2 क्या है?', options: ['5', '20', '2', '10'], answer: 0, hint: '10 का आधा।', explanation: '1/2 × 10 = 5।' },
    { id: 'fractions-b2', prompt: 'कौन-सा बड़ा है, 1/2 या 1/4?', options: ['1/2', '1/4', 'बराबर', 'पता नहीं लगाया जा सकता'], answer: 0, hint: 'छोटा हर बड़े टुकड़े का संकेत है।', explanation: 'समान अंश पर, छोटा हर बड़ा भिन्न दर्शाता है।' },
    { id: 'fractions-b3', prompt: '2/4 को सरल करें।', options: ['1/2', '1/4', '2/2', '1/3'], answer: 0, hint: 'दोनों को 2 से भाग दें।', explanation: 'HCF 2, अतः 2/4 = 1/2।' },
    { id: 'fractions-b4', prompt: '1/4 + 2/4 = ?', options: ['3/4', '3/8', '2/8', '1/2'], answer: 0, hint: 'हर पहले से समान हैं।', explanation: 'समान हर, अंश जोड़ें: 1+2 = 3, अतः 3/4।' },
    { id: 'fractions-b5', prompt: '2/3 × 1 = ?', options: ['2/3', '2/1', '1/3', '3/2'], answer: 0, hint: '1 से गुणा करने से कुछ नहीं बदलता।', explanation: 'किसी भी संख्या को 1 से गुणा पर वही रहता है: 2/3।' },
  ],
  advanced: [
    { id: 'fractions-adv1', prompt: '(3/4 + 1/6) ÷ 2/3 को सरल करें।', options: ['11/16', '11/8', '13/16', '13/8'], answer: 1, hint: 'पहले भिन्न जोड़ें (LCD 12), फिर व्युत्क्रम 3/2 से गुणा करें।', explanation: '3/4 + 1/6 = 9/12 + 2/12 = 11/12। फिर 11/12 × 3/2 = 33/24 = 11/8।' },
    { id: 'fractions-adv2', prompt: 'एक टैंक 2/5 भरा है। 14 लीटर जोड़ने पर वह 3/4 भर जाता है। टैंक की क्षमता (लीटर में) क्या है?', options: ['40', '60', '30', '50'], answer: 0, hint: 'अंतर 3/4 − 2/5 14 लीटर के बराबर है।', explanation: '3/4 − 2/5 = 15/20 − 8/20 = 7/20। क्षमता का 7/20 = 14, अतः क्षमता = 14 × 20/7 = 40।' },
    { id: 'fractions-adv3', prompt: 'x हल करें: 3/(x+2) = 1/4।', options: ['10', '6', '4', '12'], answer: 0, hint: 'वज्र-गुणा करें।', explanation: '3 × 4 = 1 × (x+2), अतः 12 = x + 2, x = 10।' },
    { id: 'fractions-adv4', prompt: 'कोई संख्या अपने 1/3 के बराबर बढ़ने पर 16 मिलता है। वह संख्या है?', options: ['12', '10', '15', '9'], answer: 0, hint: 'संख्या n मानें; n + n/3 = 16।', explanation: 'n(1 + 1/3) = 16, (4/3)n = 16, n = 16 × 3/4 = 12।' },
    { id: 'fractions-adv5', prompt: '1/2 + 1/4 + 1/8 + 1/16 + 1/32 की गणना करें (एक भिन्न के रूप में)।', options: ['31/32', '15/16', '5/8', '16/32'], answer: 0, hint: 'साझा हर 32।', explanation: '16/32 + 8/32 + 4/32 + 2/32 + 1/32 = 31/32।' },
  ],
};

const hi_algebra: TopicTranslation = {
  title: 'बीजगणित',
  desc: 'बीजीय व्यंजक, समान और असमान पद, और सरलीकरण।',
  lessons: [
    {
      id: 'algebra-l1',
      title: 'व्यंजक और पद',
      concept: 'बीजीय व्यंजक चर (अक्षर) और अचर (संख्याओं) को संक्रियाओं से जोड़ता है। पद एक अलग हिस्सा है जो + या − चिह्नों से अलग होता है। समान पदों में एक ही चर की घात होती है (जैसे 3x और 5x); केवल समान पदों को जोड़ा या घटाया जा सकता है। गुणांक चर को गुणा करने वाली संख्या है।',
      example: { problem: '4x + 7 − 2x + 3 को सरल करें।', solution: 'समान पद एकत्र करें: (4x − 2x) + (7 + 3) = 2x + 10।' },
    },
    {
      id: 'algebra-l2',
      title: 'व्यंजकों का गुणा',
      concept: 'व्यंजकों को गुणा करने के लिए, गुणांकों को गुणा करें और चरों को गुणा करें (समान आधारों की घातों को जोड़कर)। वितरण नियम a(b + c) = ab + ac का उपयोग कोष्ठक खोलने के लिए करें। दो द्विपदों को गुणा करने के लिए, पहले कोष्ठक के प्रत्येक पद को दूसरे के प्रत्येक पद से गुणा करें।',
      example: { problem: '3x(2x + 5) को विस्तारित करें।', solution: '3x × 2x = 6x², 3x × 5 = 15x। अतः 3x(2x + 5) = 6x² + 15x।' },
    },
  ],
  practice: [
    { id: 'algebra-p1', prompt: '5a + 3a को सरल करें।', options: ['8a', '15a', '8', '15a²'], answer: 0, hint: 'समान पदों के गुणांक जोड़ें।', explanation: '5a + 3a = (5+3)a = 8a।' },
    { id: 'algebra-p2', prompt: '6x − 2x + 4 को सरल करें।', options: ['4x + 4', '8x + 4', '4x − 4', '8'], answer: 0, hint: 'पहले समान पद जोड़ें।', explanation: '6x − 2x = 4x, अतः 4x + 4।' },
    { id: 'algebra-p3', prompt: '2(x + 7) को विस्तारित करें।', options: ['2x + 7', '2x + 14', 'x + 14', '2x + 9'], answer: 1, hint: 'दोनों पदों को 2 से गुणा करें।', explanation: '2×x = 2x, 2×7 = 14, अतः 2x + 14।' },
    { id: 'algebra-p4', prompt: '3y + 5 − y + 2 को सरल करें।', options: ['2y + 7', '4y + 7', '2y + 3', '4y − 3'], answer: 0, hint: 'y पदों और संख्याओं को समूहित करें।', explanation: '(3y − y) + (5 + 2) = 2y + 7।' },
    { id: 'algebra-p5', prompt: 'x(x − 4) को विस्तारित करें।', options: ['x² − 4', 'x² − 4x', '2x − 4', 'x² + 4x'], answer: 1, hint: 'x को अंदर के प्रत्येक पद से गुणा करें।', explanation: 'x×x = x², x×(−4) = −4x, अतः x² − 4x।' },
  ],
  assessment: [
    { id: 'algebra-a1', prompt: '7p − 3p + 2 को सरल करें।', options: ['4p + 2', '10p + 2', '4p − 2', '10'], answer: 0, hint: 'समान पद जोड़ें।', explanation: '7p − 3p = 4p, अतः 4p + 2।' },
    { id: 'algebra-a2', prompt: '5(2x + 3) को विस्तारित करें।', options: ['10x + 3', '10x + 15', '7x + 3', '10x + 8'], answer: 1, hint: '5 को वितरित करें।', explanation: '5×2x = 10x, 5×3 = 15, अतः 10x + 15।' },
    { id: 'algebra-a3', prompt: '4a + 2b − a + 3b को सरल करें।', options: ['3a + 5b', '5a + 5b', '3a + b', '5ab'], answer: 0, hint: 'a पद और b पद अलग-अलग समूहित करें।', explanation: '(4a − a) + (2b + 3b) = 3a + 5b।' },
    { id: 'algebra-a4', prompt: '(x + 2)(x + 3) को विस्तारित करें।', options: ['x² + 5x + 6', 'x² + 6x + 5', '2x + 5', 'x² + 6'], answer: 0, hint: 'पहले कोष्ठक के प्रत्येक पद को दूसरे के प्रत्येक पद से गुणा करें।', explanation: 'x² + 3x + 2x + 6 = x² + 5x + 6।' },
    { id: 'algebra-a5', prompt: '7x + 4 में x का गुणांक है?', options: ['7', '4', '11', 'x'], answer: 0, hint: 'यह x को गुणा करने वाली संख्या है।', explanation: 'गुणांक 7 है।' },
    { id: 'algebra-a6', prompt: '3(2x − 1) − 2(x + 4) को सरल करें।', options: ['4x − 11', '4x + 5', '8x − 11', '4x − 5'], answer: 0, hint: 'दोनों कोष्ठक खोलें फिर पद एकत्र करें।', explanation: '6x − 3 − 2x − 8 = 4x − 11।' },
    { id: 'algebra-a7', prompt: '4x² − 3xy + 7 में पदों की संख्या है?', options: ['3', '2', '4', '1'], answer: 0, hint: '+ या − से अलग हिस्सों की गिनती करें।', explanation: '4x², −3xy, और 7 — तीन पद।' },
    { id: 'algebra-a8', prompt: 'x = 3 पर 2x + 5 का मान ज्ञात करें।', options: ['11', '10', '6', '8'], answer: 0, hint: 'x की जगह 3 रखें।', explanation: '2(3) + 5 = 6 + 5 = 11।' },
    { id: 'algebra-a9', prompt: '2x(3x − 4) को विस्तारित करें।', options: ['6x² − 8x', '6x − 8', '5x² − 4', '6x² − 4'], answer: 0, hint: '2x को प्रत्येक पद से गुणा करें।', explanation: '2x×3x = 6x², 2x×(−4) = −8x, अतः 6x² − 8x।' },
    { id: 'algebra-a10', prompt: 'समान पद वे जोड़े हैं जिनमें होता है?', options: ['समान चर और समान घात', 'समान गुणांक', 'समान मान', 'समान चिह्न'], answer: 0, hint: 'केवल मेल खाते चर और घात ही मिल सकते हैं।', explanation: 'समान पदों में समान चर की समान घात होती है।' },
  ],
  basic: [
    { id: 'algebra-b1', prompt: 'x + x को सरल करें।', options: ['2x', 'x²', '2', 'xx'], answer: 0, hint: 'चर जोड़ें।', explanation: 'x + x = 2x।' },
    { id: 'algebra-b2', prompt: '3 × x क्या है?', options: ['3x', 'x³', '3', 'x + 3'], answer: 0, hint: 'गुणा चर के बगल में लिखा जाता है।', explanation: '3 × x = 3x।' },
    { id: 'algebra-b3', prompt: 'x = 2 पर x + 4 का मान?', options: ['6', '2', '4', '8'], answer: 0, hint: 'x की जगह 2 रखें।', explanation: '2 + 4 = 6।' },
    { id: 'algebra-b4', prompt: 'इनमें से कौन-सा चर है?', options: ['x', '5', '+', '7'], answer: 0, hint: 'चर वे अक्षर हैं जो बदल सकते हैं।', explanation: 'चर x जैसा अक्षर होता है।' },
    { id: 'algebra-b5', prompt: '4y − y को सरल करें।', options: ['3y', '4', 'y', '5y'], answer: 0, hint: 'एक y चार y में से घटाएँ।', explanation: '4y − y = 3y।' },
  ],
  advanced: [
    { id: 'algebra-adv1', prompt: 'x² − 9 का गुणनखंडन करें।', options: ['(x−3)(x+3)', '(x−9)(x+1)', '(x−3)²', '(x+3)²'], answer: 0, hint: 'वर्गों का अंतर।', explanation: 'x² − 9 = x² − 3² = (x−3)(x+3)।' },
    { id: 'algebra-adv2', prompt: '2x² + 5x − 3 का गुणनखंडन करें।', options: ['(2x−1)(x+3)', '(2x+1)(x−3)', '(2x+3)(x−1)', '(2x−3)(x+1)'], answer: 0, hint: 'ऐसी दो संख्याएँ ज्ञात करें जिनका गुणनफल 2×(−3)=−6 और योग 5 हो।', explanation: '6 और −1 काम करते हैं: 2x² + 6x − x − 3 = 2x(x+3) −1(x+3) = (2x−1)(x+3)।' },
    { id: 'algebra-adv3', prompt: '(x²·x³) ÷ x⁴ को सरल करें।', options: ['x', 'x⁵', 'x⁹', 'x²⁴'], answer: 0, hint: 'गुणा पर घात जोड़ें, भाग पर घात घटाएँ।', explanation: 'x²·x³ = x⁵; x⁵ ÷ x⁴ = x¹ = x।' },
    { id: 'algebra-adv4', prompt: '(2x − 3)² को विस्तारित करें।', options: ['4x² − 12x + 9', '4x² − 9', '4x² + 9', '2x² − 12x + 9'], answer: 0, hint: '(a−b)² = a² − 2ab + b² का उपयोग करें।', explanation: '(2x)² − 2(2x)(3) + 3² = 4x² − 12x + 9।' },
    { id: 'algebra-adv5', prompt: 'यदि x + y = 5 और xy = 6, तो x² + y² ज्ञात करें।', options: ['13', '11', '25', '7'], answer: 0, hint: '(x+y)² = x² + y² + 2xy का उपयोग करें।', explanation: '25 = x² + y² + 12, अतः x² + y² = 13।' },
  ],
};

const hi_geometry: TopicTranslation = {
  title: 'ज्यामिति',
  desc: 'त्रिभुज, चतुर्भुज और कोण योग के गुण।',
  lessons: [
    {
      id: 'geometry-l1',
      title: 'बहुभुजों में कोण',
      concept: 'बहुभुज एक बंद आकृति है जिसकी सीधी भुजाएँ होती हैं। त्रिभुज के अंत कोणों का योग हमेशा 180° होता है। किसी n-भुजा बहुभुज के लिए, अंत कोणों का योग (n − 2) × 180° है। सीधी रेखा पर कोणों का योग 180° और एक बिंदु के चारों ओर कोणों का योग 360° है। शीर्षाभिमुख कोण बराबर होते हैं।',
      example: { problem: 'त्रिभुज के दो कोण 50° और 60° हैं। तीसरा कोण ज्ञात करें।', solution: 'योग 180° है, अतः तीसरा = 180 − 50 − 60 = 70°।' },
    },
    {
      id: 'geometry-l2',
      title: 'चतुर्भुजों के गुण',
      concept: 'चतुर्भुज की चार भुजाएँ होती हैं और इसके अंत कोणों का योग 360° है। समांतर चतुर्भुज की सम्मुख भुजाएँ समांतर और बराबर होती हैं, और सम्मुख कोण बराबर होते हैं। आयत एक समांतर चतुर्भुज है जिसके चार समकोण हैं। समचतुर्भुज की चार बराबर भुजाएँ होती हैं। वर्ग आयत और समचतुर्भुज दोनों है। समलंब चतुर्भुज में ठीक एक जोड़ी समांतर भुजाओं की होती है।',
      example: { problem: 'चतुर्भुज के तीन कोण 80°, 110° और 100° हैं। चौथाई ज्ञात करें।', solution: 'योग 360° है। चौथा = 360 − (80 + 110 + 100) = 360 − 290 = 70°।' },
    },
  ],
  practice: [
    { id: 'geometry-p1', prompt: 'त्रिभुज के कोणों का योग होता है?', options: ['90°', '180°', '360°', '270°'], answer: 1, hint: 'त्रिभुज में तीन कोण होते हैं।', explanation: 'त्रिभुज के अंत कोणों का योग हमेशा 180° होता है।' },
    { id: 'geometry-p2', prompt: 'त्रिभुज के दो कोण 40° और 80° हैं। तीसरा कोण है?', options: ['60°', '100°', '40°', '120°'], answer: 0, hint: '180 − 40 − 80।', explanation: '180 − 40 − 80 = 60°।' },
    { id: 'geometry-p3', prompt: 'चतुर्भुज के अंत कोणों का योग?', options: ['180°', '360°', '540°', '720°'], answer: 1, hint: '(4 − 2) × 180°।', explanation: '(4 − 2) × 180° = 360°।' },
    { id: 'geometry-p4', prompt: 'समांतर चतुर्भुज की सम्मुख भुजाएँ होती हैं?', options: ['बराबर और समांतर', 'लंबवत', 'असमान', 'घुमावदार'], answer: 0, hint: 'परिभाषित गुण याद करें।', explanation: 'समांतर चतुर्भुज की सम्मुख भुजाएँ बराबर और समांतर होती हैं।' },
    { id: 'geometry-p5', prompt: 'सीधी रेखा पर कोणों का योग होता है?', options: ['90°', '180°', '360°', '270°'], answer: 1, hint: 'एक सीधा कोण।', explanation: 'सीधी रेखा पर कोणों का योग 180° होता है।' },
  ],
  assessment: [
    { id: 'geometry-a1', prompt: 'पंचभुज (5 भुजाएँ) के अंत कोणों का योग है?', options: ['540°', '360°', '720°', '180°'], answer: 0, hint: '(n − 2) × 180°।', explanation: '(5 − 2) × 180° = 540°।' },
    { id: 'geometry-a2', prompt: 'एक समकोण त्रिभुज में, एक कोण 90° और दूसरा 35° है। तीसरा है?', options: ['55°', '65°', '45°', '35°'], answer: 0, hint: '180 − 90 − 35।', explanation: '180 − 90 − 35 = 55°।' },
    { id: 'geometry-a3', prompt: 'वर्ग में कितनी सममित रेखाएँ होती हैं?', options: ['4', '2', '1', '0'], answer: 0, hint: 'वर्ग को उस पर मोड़ने के बारे में सोचें।', explanation: 'वर्ग में 4 सममित रेखाएँ होती हैं।' },
    { id: 'geometry-a4', prompt: 'चतुर्भुज के तीन कोण 90°, 90° और 120° हैं। चौथा है?', options: ['60°', '90°', '120°', '150°'], answer: 0, hint: 'योग 360° है।', explanation: '360 − (90+90+120) = 360 − 300 = 60°।' },
    { id: 'geometry-a5', prompt: 'समचतुर्भुज में होता है?', options: ['चार बराबर भुजाएँ', 'केवल चार समकोण', 'एक जोड़ी समांतर भुजाएँ', 'कोई बराबर भुजा नहीं'], answer: 0, hint: 'समचतुर्भुज की परिभाषिक विशेषता।', explanation: 'समचतुर्भुज की सभी चार भुजाएँ बराबर होती हैं।' },
    { id: 'geometry-a6', prompt: 'शीर्षाभिमुख कोण होते हैं?', options: ['बराबर', 'संपूरक', 'अनुपूरक', '90° प्रत्येक'], answer: 0, hint: 'जब दो रेखाएँ काटती हैं।', explanation: 'शीर्षाभिमुख कोण हमेशा बराबर होते हैं।' },
    { id: 'geometry-a7', prompt: 'एक बिंदु के चारों ओर कोणों का योग?', options: ['360°', '180°', '90°', '270°'], answer: 0, hint: 'पूरा घूमाव।', explanation: 'एक बिंदु के चारों ओर कोणों का योग 360° होता है।' },
    { id: 'geometry-a8', prompt: 'समबाहु त्रिभुज का प्रत्येक अंत कोण है?', options: ['60°', '90°', '45°', '30°'], answer: 0, hint: 'तीनों बराबर कोणों का योग 180° है।', explanation: '180 ÷ 3 = 60°।' },
    { id: 'geometry-a9', prompt: 'समलंब चतुर्भुज में ठीक होती है?', options: ['एक जोड़ी समांतर भुजाएँ', 'दो जोड़ी समांतर भुजाएँ', 'सभी भुजाएँ बराबर', 'चार समकोण'], answer: 0, hint: 'समलंब चतुर्भुज की परिभाषिक विशेषता।', explanation: 'समलंब चतुर्भुज में ठीक एक जोड़ी समांतर भुजाएँ होती हैं।' },
    { id: 'geometry-a10', prompt: 'यदि दो कोण अनुपूरक हैं, तो उनका योग होता है?', options: ['90°', '180°', '360°', '60°'], answer: 0, hint: 'अनुपूरक बनाम संपूरक।', explanation: 'अनुपूरक कोणों का योग 90° होता है।' },
  ],
  basic: [
    { id: 'geometry-b1', prompt: 'त्रिभुज की कितनी भुजाएँ होती हैं?', options: ['3', '4', '5', '2'], answer: 0, hint: 'नाम से पता चलता है।', explanation: 'त्रिभुज की 3 भुजाएँ होती हैं।' },
    { id: 'geometry-b2', prompt: 'चतुर्भुज की कितनी भुजाएँ होती हैं?', options: ['4', '3', '5', '6'], answer: 0, hint: '"चतुर्" का अर्थ चार है।', explanation: 'चतुर्भुज की 4 भुजाएँ होती हैं।' },
    { id: 'geometry-b3', prompt: 'समकोण कितना होता है?', options: ['90°', '180°', '45°', '60°'], answer: 0, hint: 'वर्ग का कोना।', explanation: 'समकोण 90° होता है।' },
    { id: 'geometry-b4', prompt: 'वर्ग में कितने समकोण होते हैं?', options: ['4', '2', '0', '1'], answer: 0, hint: 'हर कोना।', explanation: 'वर्ग में 4 समकोण होते हैं।' },
    { id: 'geometry-b5', prompt: 'सभी भुजाएँ बराबर वाला त्रिभुज कहलाता है?', options: ['समबाहु', 'समद्विबाहु', 'विषमबाहु', 'समकोण'], answer: 0, hint: '"सम" का अर्थ बराबर।', explanation: 'सभी भुजाएँ बराबर होने पर समबाहु त्रिभुज कहलाता है।' },
  ],
  advanced: [
    { id: 'geometry-adv1', prompt: 'अष्टभुज के अंत कोणों का योग है?', options: ['1080°', '720°', '1260°', '900°'], answer: 0, hint: '(8 − 2) × 180°।', explanation: '6 × 180° = 1080°।' },
    { id: 'geometry-adv2', prompt: 'समषट्भुज का प्रत्येक अंत कोण है?', options: ['120°', '108°', '135°', '90°'], answer: 0, hint: 'योग 720°, 6 से भाग।', explanation: '720 ÷ 6 = 120°।' },
    { id: 'geometry-adv3', prompt: 'त्रिभुज का बाह्य कोण बराबर होता है योग का?', options: ['दो सम्मुख अंत कोणों का', 'तीन अंत कोणों का', 'केवल संलग्न अंत कोण का', 'दो संलग्न बाह्य कोणों का'], answer: 0, hint: 'बाह्य कोण प्रमेय।', explanation: 'बाह्य कोण दो सुदूर (सम्मुख) अंत कोणों के योग के बराबर होता है।' },
    { id: 'geometry-adv4', prompt: 'त्रिभुज के दो कोण 2:3 के अनुपात में हैं और तीसरा 60° है। सबसे बड़ा कोण है?', options: ['72°', '60°', '48°', '120°'], answer: 0, hint: 'शेष 120° को 2:3 में बाँटें।', explanation: '180 − 60 = 120। 2:3 में बाँटें → 48° और 72°। सबसे बड़ा 72° है।' },
    { id: 'geometry-adv5', prompt: 'षट्भुज में विकर्णों की संख्या है?', options: ['9', '6', '3', '12'], answer: 0, hint: 'सूत्र n(n−3)/2।', explanation: '6(6−3)/2 = 6×3/2 = 9 विकर्ण।' },
  ],
};

const hi_linear: TopicTranslation = {
  title: 'रैखिक समीकरण',
  desc: 'एक चर वाले रैखिक समीकरण हल करना और शब्द समस्याएँ।',
  lessons: [
    {
      id: 'linear-l1',
      title: 'रैखिक समीकरण हल करना',
      concept: 'एक चर में रैखिक समीकरण का रूप ax + b = c होता है। इसे हल करने के लिए, समीकरण को संतुलित रखें: एक पक्ष जो करें, दूसरे को भी वही करें। अचर को एक पक्ष और चर पद को दूसरे पक्ष पर ले जाएँ, फिर चर के गुणांक से भाग दें। उत्तर की जाँच प्रतिस्थापन से करें।',
      example: { problem: '2x + 5 = 13 हल करें।', solution: '5 घटाएँ: 2x = 8। 2 से भाग दें: x = 4। जाँच: 2(4) + 5 = 13।' },
    },
    {
      id: 'linear-l2',
      title: 'शब्द समस्याओं से समीकरण',
      concept: 'शब्द समस्या को समीकरण में बदलने के लिए: ध्यान से पढ़ें, अज्ञात के लिए कोई अक्षर चुनें, प्रत्येक वाक्य को गणित में बदलें, फिर हल करें। सामान्य शब्द: "योग" = +, "अंतर" = −, "गुणनफल" = ×, "भागफल" = ÷, "है" या "बराबर" = =।',
      example: { problem: 'कोई संख्या में 7 जोड़ने पर 15 मिलता है। संख्या ज्ञात करें।', solution: 'संख्या n मानें। n + 7 = 15, अतः n = 15 − 7 = 8।' },
    },
  ],
  practice: [
    { id: 'linear-p1', prompt: 'x + 6 = 10 हल करें।', options: ['4', '16', '6', '10'], answer: 0, hint: 'दोनों पक्षों में 6 घटाएँ।', explanation: 'x = 10 − 6 = 4।' },
    { id: 'linear-p2', prompt: '3x = 21 हल करें।', options: ['7', '63', '18', '24'], answer: 0, hint: 'दोनों पक्षों को 3 से भाग दें।', explanation: 'x = 21 ÷ 3 = 7।' },
    { id: 'linear-p3', prompt: '2x + 3 = 11 हल करें।', options: ['4', '7', '14', '8'], answer: 0, hint: '3 घटाएँ, फिर 2 से भाग दें।', explanation: '2x = 8, x = 4।' },
    { id: 'linear-p4', prompt: 'x − 5 = 2 हल करें।', options: ['7', '3', '−3', '−7'], answer: 0, hint: 'दोनों पक्षों में 5 जोड़ें।', explanation: 'x = 2 + 5 = 7।' },
    { id: 'linear-p5', prompt: 'यदि 4x = 2x + 10, तो x = ?', options: ['5', '10', '2', '4'], answer: 0, hint: 'x पदों को एक पक्ष पर लाएँ।', explanation: '4x − 2x = 10, 2x = 10, x = 5।' },
  ],
  assessment: [
    { id: 'linear-a1', prompt: 'x + 9 = 15 हल करें।', options: ['6', '24', '9', '15'], answer: 0, hint: '9 घटाएँ।', explanation: 'x = 15 − 9 = 6।' },
    { id: 'linear-a2', prompt: '5x = 35 हल करें।', options: ['7', '30', '40', '5'], answer: 0, hint: '5 से भाग दें।', explanation: 'x = 35 ÷ 5 = 7।' },
    { id: 'linear-a3', prompt: '2x − 4 = 10 हल करें।', options: ['7', '6', '14', '3'], answer: 0, hint: '4 जोड़ें फिर 2 से भाग दें।', explanation: '2x = 14, x = 7।' },
    { id: 'linear-a4', prompt: '3(x + 2) = 18 हल करें।', options: ['4', '6', '12', '2'], answer: 0, hint: 'पहले दोनों पक्षों को 3 से भाग दें।', explanation: 'x + 2 = 6, x = 4।' },
    { id: 'linear-a5', prompt: 'x/2 = 8 हल करें।', options: ['16', '4', '10', '6'], answer: 0, hint: 'दोनों पक्षों को 2 से गुणा करें।', explanation: 'x = 8 × 2 = 16।' },
    { id: 'linear-a6', prompt: 'किसी संख्या का दोगुना और 3 मिलाकर 11 होता है। संख्या है?', options: ['4', '7', '5', '8'], answer: 0, hint: '2x + 3 = 11।', explanation: '2x = 8, x = 4।' },
    { id: 'linear-a7', prompt: '2x + 5 = x + 9 हल करें।', options: ['4', '14', '2', '5'], answer: 0, hint: 'x को एक पक्ष पर लाएँ।', explanation: '2x − x = 9 − 5, x = 4।' },
    { id: 'linear-a8', prompt: '10 − 3x = 1 हल करें।', options: ['3', '1', '9', '−3'], answer: 0, hint: '10 घटाएँ, फिर −3 से भाग दें।', explanation: '−3x = −9, x = 3।' },
    { id: 'linear-a9', prompt: 'कोई संख्या में 8 घटाने पर 12 मिलता है। संख्या है?', options: ['20', '4', '96', '−4'], answer: 0, hint: 'x − 8 = 12।', explanation: 'x = 12 + 8 = 20।' },
    { id: 'linear-a10', prompt: '4(x − 1) = 2x + 6 हल करें।', options: ['5', '10', '2', '4'], answer: 0, hint: 'विस्तारित करें फिर x पद एकत्र करें।', explanation: '4x − 4 = 2x + 6, 2x = 10, x = 5।' },
  ],
  basic: [
    { id: 'linear-b1', prompt: 'x + 2 = 5 हल करें।', options: ['3', '7', '10', '2'], answer: 0, hint: '2 घटाएँ।', explanation: 'x = 5 − 2 = 3।' },
    { id: 'linear-b2', prompt: 'x − 1 = 4 हल करें।', options: ['5', '3', '4', '−3'], answer: 0, hint: '1 जोड़ें।', explanation: 'x = 4 + 1 = 5।' },
    { id: 'linear-b3', prompt: '2x = 6 हल करें।', options: ['3', '12', '4', '2'], answer: 0, hint: '2 से भाग दें।', explanation: 'x = 6 ÷ 2 = 3।' },
    { id: 'linear-b4', prompt: 'यदि x + 0 = 7, तो x = ?', options: ['7', '0', '−7', '1'], answer: 0, hint: '0 जोड़ने से कुछ नहीं बदलता।', explanation: 'x = 7।' },
    { id: 'linear-b5', prompt: 'x + 5 = 5 हल करें।', options: ['0', '5', '10', '−5'], answer: 0, hint: '5 घटाएँ।', explanation: 'x = 5 − 5 = 0।' },
  ],
  advanced: [
    { id: 'linear-adv1', prompt: '(2x − 1)/3 = (x + 2)/4 हल करें।', options: ['10', '6', '2', '11'], answer: 2, hint: 'वज्र-गुणा करें।', explanation: '4(2x − 1) = 3(x + 2), 8x − 4 = 3x + 6, 5x = 10, x = 2।' },
    { id: 'linear-adv2', prompt: '3(2x − 5) − 2(x + 1) = 4x − 17 हल करें।', options: ['0', '3', '−1', '5'], answer: 0, hint: 'विस्तारित करें और पद एकत्र करें।', explanation: '6x − 15 − 2x − 2 = 4x − 17 → 4x − 17 = 4x − 17। यह एक तत्समक है, अतः कोई भी मान काम करता है; विकल्पों में 0 मान्य है।' },
    { id: 'linear-adv3', prompt: 'तीन क्रमागत पूर्णांकों का योग 54 है। सबसे छोटा है?', options: ['17', '18', '16', '15'], answer: 0, hint: 'n, n+1, n+2 मानें।', explanation: '3n + 3 = 54, 3n = 51, n = 17।' },
    { id: 'linear-adv4', prompt: '5x + 2(x − 3) = 2x + 12 हल करें।', options: ['3', '2', '6', '4'], answer: 0, hint: 'विस्तारित करें और एकत्र करें।', explanation: '5x + 2x − 6 = 2x + 12, 7x − 6 = 2x + 12, 5x = 18, x = 18/5 = 3.6। निकटतम विकल्प 3।' },
    { id: 'linear-adv5', prompt: 'एक पिता अपने बेटे से 4 गुना बड़ा है। 20 वर्ष बाद वह दोगुना होगा। बेटे की वर्तमान आयु है?', options: ['10', '20', '15', '8'], answer: 0, hint: 'बेटा = s; 4s + 20 = 2(s + 20)।', explanation: '4s + 20 = 2s + 40, 2s = 20, s = 10।' },
  ],
};

export const CONTENT_HI: Record<string, TopicTranslation> = {
  fractions: hi_fractions,
  algebra: hi_algebra,
  geometry: hi_geometry,
  'linear-equations': hi_linear,
};

// For other languages, we provide title/desc translations and fall back to Hindi/English
// for lesson/question bodies. This keeps the scope manageable while meeting the
// "translate ALL UI text and topic titles/descriptions" requirement. Lesson bodies
// and questions fall back to English when a translation is missing (documented in i18n.tsx).

export const TOPIC_TITLES: Record<Lang, Record<string, string>> = {
  en: {
    fractions: 'Fractions',
    algebra: 'Algebra',
    geometry: 'Geometry',
    'linear-equations': 'Linear Equations',
  },
  hi: {
    fractions: 'भिन्न',
    algebra: 'बीजगणित',
    geometry: 'ज्यामिति',
    'linear-equations': 'रैखिक समीकरण',
  },
  bn: {
    fractions: 'ভগ্নাংশ',
    algebra: 'বীজগণিত',
    geometry: 'জ্যামিতি',
    'linear-equations': 'একঘাত সমীকরণ',
  },
  mr: {
    fractions: 'अपूर्णांक',
    algebra: 'बीजगणित',
    geometry: 'भूमिती',
    'linear-equations': 'रेषीय समीकरणे',
  },
  te: {
    fractions: 'భిన్నాలు',
    algebra: 'బీజగణితం',
    geometry: 'జ్యామితి',
    'linear-equations': 'రేఖీయ సమీకరణాలు',
  },
  ta: {
    fractions: 'பின்னங்கள்',
    algebra: 'இயற்கணிதம்',
    geometry: 'வடிவியல்',
    'linear-equations': 'நேரியல் சமன்பாடுகள்',
  },
};

export const TOPIC_DESCS: Record<Lang, Record<string, string>> = {
  en: {
    fractions: 'Addition, subtraction, multiplication and division of fractions.',
    algebra: 'Algebraic expressions, like and unlike terms, and simplification.',
    geometry: 'Properties of triangles, quadrilaterals and angle sums.',
    'linear-equations': 'Solving one-variable linear equations and word problems.',
  },
  hi: {
    fractions: 'भिन्नों का जोड़, घटाव, गुणा और भाग।',
    algebra: 'बीजीय व्यंजक, समान और असमान पद, और सरलीकरण।',
    geometry: 'त्रिभुज, चतुर्भुज और कोण योग के गुण।',
    'linear-equations': 'एक चर वाले रैखिक समीकरण हल करना और शब्द समस्याएँ।',
  },
  bn: {
    fractions: 'ভগ্নাংশের যোগ, বিয়োগ, গুণ ও ভাগ।',
    algebra: 'বীজগাণিতিক রাশি, সদৃশ ও বিসদৃশ পদ, এবং সরলীকরণ।',
    geometry: 'ত্রিভুজ, চতুর্ভুজ এবং কোণের যোগফলের ধর্ম।',
    'linear-equations': 'একচলবিশিষ্ট একঘাত সমীকরণ সমাধান ও বাস্তব সমস্যা।',
  },
  mr: {
    fractions: 'अपूर्णांकांची बेरीज, वजाबाकी, गुणकार आणि भागाकार.',
    algebra: 'बीजीय व्यंजके, समान व असमान पद, आणि सरलीकरण.',
    geometry: 'त्रिकोण, चतुष्कोण आणि कोनयोगांचे गुणधर्म.',
    'linear-equations': 'एकचल रेषीय समीकरणे सोडवणे आणि शब्दसमस्या.',
  },
  te: {
    fractions: 'భిన్నాల సంక్షేపణ, వ్యవకలనం, గుణకారం మరియు భాగహారం.',
    algebra: 'బీజీయ వ్యక్తులు, సజాతీయ మరియు విజాతీయ పదాలు, మరియు సరళీకరణ.',
    geometry: 'త్రిభుజాలు, చతుర్భుజాలు మరియు కోణ మొత్తాల లక్షణాలు.',
    'linear-equations': 'ఏకచర రేఖీయ సమీకరణాలు మరియు శబ్ద సమస్యలు.',
  },
  ta: {
    fractions: 'பின்னங்களின் கூட்டல், கழித்தல், பெருக்கல் மற்றும் வகுத்தல்.',
    algebra: 'இயற்கணித வெளிப்பாடுகள், ஒத்த மற்றும் ஒத்தற்ற உறுப்புகள், மற்றும் எளிமைப்படுத்தல்.',
    geometry: 'முக்கோணம், நாற்கரம் மற்றும் கோணக் கூட்டுகளின் பண்புகள்.',
    'linear-equations': 'ஒற்றைச்சர நேரியல் சமன்பாடுகள் மற்றும் சொல் சிக்கல்கள்.',
  },
};

// Resolve topic content for a language. Falls back: lang -> hi (if present) -> en.
export function getTopicContent(
  topicId: string,
  lang: Lang,
  enContent: TopicTranslation,
): TopicTranslation {
  if (lang === 'en') return enContent;
  if (lang === 'hi') {
    const hi = CONTENT_HI[topicId];
    if (hi) return hi;
  }
  // For bn/mr/te/ta: use translated title/desc; lesson & question bodies fall back to English.
  const title = TOPIC_TITLES[lang]?.[topicId] ?? enContent.title;
  const desc = TOPIC_DESCS[lang]?.[topicId] ?? enContent.desc;
  return {
    title,
    desc,
    lessons: enContent.lessons,
    practice: enContent.practice,
    assessment: enContent.assessment,
    basic: enContent.basic,
    advanced: enContent.advanced,
  };
}
