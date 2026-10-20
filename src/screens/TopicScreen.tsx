import { useMemo } from 'react';
import { TOPICS_BY_ID } from '@/data/content';
import { getTopicContent } from '@/data/contentI18n';
import type { AppData } from '@/lib/useAppData';
import { useI18n } from '@/lib/i18n';
import { VideoCard } from '@/components/VideoCard';
import { ChevronRight, Check, BookOpen, Pencil, ClipboardCheck } from 'lucide-react';

type Props = {
  topic: string;
  data: AppData;
  online: boolean;
  onBack: () => void;
  onOpenLesson: (lessonId: string) => void;
  onOpenPractice: (set: 'practice' | 'basic' | 'advanced') => void;
  onOpenAssessment: () => void;
  onVideoOpened: () => void;
};

export function TopicScreen({
  topic,
  data,
  online,
  onBack,
  onOpenLesson,
  onOpenPractice,
  onOpenAssessment,
  onVideoOpened,
}: Props) {
  const { lang, t } = useI18n();
  const base = useMemo(() => TOPICS_BY_ID[topic], [topic]);
  const tc = useMemo(() => getTopicContent(topic, lang, base), [topic, lang, base]);
  const p = data.progress[topic];
  const completedLessons = p?.completed_lessons ?? 0;
  const hasQuiz = p && p.last_score > 0;

  const steps = [
    {
      id: 'learn',
      title: t('learn'),
      sub: t('lessonsComplete', { done: completedLessons, total: tc.lessons.length }),
      done: completedLessons >= tc.lessons.length,
      icon: BookOpen,
      action: () => onOpenLesson(tc.lessons[0].id),
    },
    {
      id: 'practice',
      title: t('practice'),
      sub: t('questionsWithFeedback'),
      done: false,
      icon: Pencil,
      action: () => onOpenPractice('practice'),
    },
    {
      id: 'assess',
      title: t('assessment'),
      sub: t('questionQuiz'),
      done: !!hasQuiz,
      icon: ClipboardCheck,
      action: onOpenAssessment,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button
        onClick={onBack}
        className="text-sm text-[var(--muted)] mb-4 inline-flex items-center gap-1"
      >
        ← {t('back')}
      </button>
      <h1 className="text-2xl">{tc.title}</h1>
      <p className="text-sm text-[var(--muted)] mt-1 mb-6">{tc.desc}</p>

      <div className="space-y-3">
        {steps.map((s) => (
          <button
            key={s.id}
            onClick={s.action}
            className="card w-full text-left flex items-center gap-3"
          >
            <span
              className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                s.done
                  ? 'bg-[var(--ink)] text-[var(--bg)] border-[var(--ink)]'
                  : 'border-[var(--line)]'
              }`}
            >
              {s.done ? (
                <Check className="w-4 h-4" strokeWidth={2.2} />
              ) : (
                <s.icon className="w-4 h-4" strokeWidth={1.7} />
              )}
            </span>
            <span className="flex-1">
              <span className="block text-base font-medium">{s.title}</span>
              <span className="block text-xs text-[var(--muted)]">{s.sub}</span>
            </span>
            <ChevronRight className="w-5 h-5 text-[var(--muted)]" strokeWidth={1.7} />
          </button>
        ))}
      </div>

      <div className="mt-6">
        <VideoCard topicId={topic} online={online} onOpened={onVideoOpened} />
      </div>

      <div className="mt-6">
        <p className="label mb-2">{t('extraPracticeSets')}</p>
        <div className="grid grid-cols-2 gap-3">
          <button className="card text-left" onClick={() => onOpenPractice('basic')}>
            <p className="text-sm font-medium">{t('basicSet')}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">{t('easierQuestions')}</p>
          </button>
          <button className="card text-left" onClick={() => onOpenPractice('advanced')}>
            <p className="text-sm font-medium">{t('advancedSet')}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">{t('harderQuestions')}</p>
          </button>
        </div>
      </div>
    </div>
  );
}
