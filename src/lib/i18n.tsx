import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Lang = 'en' | 'hi' | 'bn' | 'mr' | 'te' | 'ta';

export const LANGUAGES: { code: Lang; nativeName: string; label: string }[] = [
  { code: 'en', nativeName: 'English', label: 'English' },
  { code: 'hi', nativeName: 'हिन्दी', label: 'Hindi' },
  { code: 'bn', nativeName: 'বাংলা', label: 'Bengali' },
  { code: 'mr', nativeName: 'मराठी', label: 'Marathi' },
  { code: 'te', nativeName: 'తెలుగు', label: 'Telugu' },
  { code: 'ta', nativeName: 'தமிழ்', label: 'Tamil' },
];

export const DEFAULT_LANG: Lang = 'en';

const STORAGE_KEY = 'offlinelearn_lang';

// UI dictionary keys
export type UIKey =
  | 'appName' | 'welcomeBack' | 'createAccount' | 'name' | 'email' | 'password'
  | 'signIn' | 'signUp' | 'signOut' | 'hello' | 'greeting'
  | 'dontHaveAccount' | 'alreadyHaveAccount' | 'enterName'
  | 'emailOrPasswordIncorrect' | 'accountExists' | 'tooManyTries'
  | 'atLeast6Chars' | 'class8Math' | 'worksOffline'
  | 'recommendedForYou' | 'topics' | 'viewProgress' | 'download'
  | 'downloadIn' | 'availableOffline' | 'best' | 'downloadTip'
  | 'back' | 'backTo' | 'learn' | 'practice' | 'assessment'
  | 'lessonsComplete' | 'questionsWithFeedback' | 'questionQuiz'
  | 'extraPracticeSets' | 'basicSet' | 'advancedSet'
  | 'easierQuestions' | 'harderQuestions'
  | 'lesson' | 'of' | 'concept' | 'workedExample' | 'problem' | 'solution'
  | 'markComplete' | 'completed' | 'nextLesson' | 'doneBackToTopic'
  | 'question' | 'showHint' | 'hint' | 'explanation' | 'prev' | 'next'
  | 'submitQuiz' | 'finish' | 'result' | 'correctOf' | 'status'
  | 'review' | 'correctAnswer' | 'yourAnswer'
  | 'weakTopic' | 'needsPractice' | 'goodUnderstanding'
  | 'yourProgress' | 'scoresByTopic' | 'strengths' | 'weakAreas'
  | 'noStrongTopics' | 'noWeakTopics' | 'attemptHistory' | 'noAttempts'
  | 'topic' | 'score' | 'attempt' | 'synced' | 'pending'
  | 'performanceRecs' | 'level'
  | 'evaluationPanel' | 'demoMetrics' | 'offlineTopicsTouched'
  | 'syncSuccessRate' | 'records' | 'dataUsedSession' | 'pendingSync'
  | 'queuedRecords' | 'syncAttempts' | 'successful' | 'syncNow'
  | 'recommendations' | 'relevance' | 'wasThisRelevant' | 'yes' | 'no'
  | 'localRecords' | 'attemptsStoredOnDevice' | 'videosOpenedSession'
  | 'settings' | 'simulateOffline' | 'simulateOfflineDesc'
  | 'translationsNote' | 'offline' | 'online' | 'syncing' | 'sync'
  | 'offlineBanner' | 'recordsSynced' | 'nothingToSync' | 'demoDataLoaded'
  | 'loading' | 'exit' | 'untimed' | 'home' | 'progress' | 'demo'
  | 'referenceVideo' | 'watchVideo' | 'usesMobileData'
  | 'videoNeedsInternet' | 'openInYouTube' | 'videoSource' | 'videoLanguage'
  | 'noRecommendations' | 'takeQuizToGenerate'
  | 'practiceQuestions' | 'basicPracticeSet' | 'advancedPracticeSet'
  | 'goTo' | 'orMoveToNextTopic' | 'language';

import { UI_STRINGS } from '@/data/uiStrings';

type I18nContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: UIKey, vars?: Record<string, string | number>) => string;
  isIndic: boolean;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function detectInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && LANGUAGES.some((l) => l.code === stored)) return stored;
  } catch { /* ignore */ }
  return DEFAULT_LANG;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
  }, []);

  const isIndic = lang !== 'en';

  const t = useCallback(
    (key: UIKey, vars?: Record<string, string | number>) => {
      const dict = UI_STRINGS[lang] as Partial<Record<UIKey, string>> | undefined;
      const en = UI_STRINGS.en as Record<UIKey, string>;
      let s = (dict && dict[key]) || en[key] || key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        }
      }
      return s;
    },
    [lang],
  );

  const value = useMemo(
    () => ({ lang, setLang, t, isIndic }),
    [lang, setLang, t, isIndic],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be inside I18nProvider');
  return ctx;
}

export function tr(lang: Lang, key: UIKey): string {
  const dict = UI_STRINGS[lang] as Partial<Record<UIKey, string>> | undefined;
  if (dict && key in dict && dict[key]) return dict[key] as string;
  const en = UI_STRINGS.en as Record<UIKey, string>;
  return en[key] ?? key;
}

export function trv(
  lang: Lang,
  key: UIKey,
  vars?: Record<string, string | number>,
): string {
  let s = tr(lang, key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return s;
}
