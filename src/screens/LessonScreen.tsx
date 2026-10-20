import { useMemo, useState } from 'react';
import { TOPICS_BY_ID } from '@/data/content';
import { getTopicContent } from '@/data/contentI18n';
import type { AppData } from '@/lib/useAppData';
import { upsertProgress } from '@/lib/sync';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';
import { VideoCard } from '@/components/VideoCard';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';

type Props = {
  topic: string;
  lessonId: string;
  data: AppData;
  online: boolean;
  onBack: () => void;
  onDone: () => void;
  onVideoOpened: () => void;
};

export function LessonScreen({ topic, lessonId, data, online, onBack, onDone, onVideoOpened }: Props) {
  const { user } = useAuth();
  const { lang, t } = useI18n();
  const base = useMemo(() => TOPICS_BY_ID[topic], [topic]);
  const tc = useMemo(() => getTopicContent(topic, lang, base), [topic, lang, base]);
  const idx = Math.max(0, tc.lessons.findIndex((l) => l.id === lessonId));
  const lesson = tc.lessons[idx];
  const [done, setDone] = useState(false);
  const completed = data.progress[topic]?.completed_lessons ?? 0;

  const markComplete = async () => {
    if (!user) return;
    const newCompleted = Math.max(completed, idx + 1);
    const status =
      newCompleted >= tc.lessons.length ? 'lessons-done' : 'in-progress';
    await upsertProgress(user.id, topic, {
      completed_lessons: newCompleted,
      status,
    });
    setDone(true);
    await data.refresh();
  };

  const next = idx < tc.lessons.length - 1 ? tc.lessons[idx + 1] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button
        onClick={onBack}
        className="text-sm text-[var(--muted)] mb-4 inline-flex items-center gap-1"
      >
        <ChevronLeft className="w-4 h-4" /> {t('backTo')} {tc.title}
      </button>
      <p className="label">
        {t('lesson')} {idx + 1} {t('of')} {tc.lessons.length}
      </p>
      <h1 className="text-2xl mt-1">{lesson.title}</h1>

      <section className="mt-5">
        <h2 className="text-base font-semibold mb-2">{t('concept')}</h2>
        <p className="text-[15px] leading-relaxed">{lesson.concept}</p>
      </section>

      <section className="mt-6 card bg-[var(--bg)]">
        <h2 className="text-base font-semibold mb-2">{t('workedExample')}</h2>
        <p className="text-sm font-medium">{t('problem')}</p>
        <p className="text-[15px] mt-1">{lesson.example.problem}</p>
        <p className="text-sm font-medium mt-3">{t('solution')}</p>
        <p className="text-[15px] mt-1">{lesson.example.solution}</p>
      </section>

      <div className="mt-6">
        <VideoCard topicId={topic} online={online} onOpened={onVideoOpened} />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={markComplete}
          disabled={done}
          className={done ? 'btn-ghost' : 'btn-primary'}
        >
          {done ? (
            <>
              <Check className="w-4 h-4" strokeWidth={2.2} /> {t('completed')}
            </>
          ) : (
            t('markComplete')
          )}
        </button>
      </div>

      {done && next && (
        <button
          className="btn-primary mt-4 w-full"
          onClick={() => onDone()}
        >
          {t('nextLesson')}: {next.title} <ChevronRight className="w-4 h-4" />
        </button>
      )}
      {done && !next && (
        <button className="btn-primary mt-4 w-full" onClick={() => onBack()}>
          {t('doneBackToTopic')}
        </button>
      )}
    </div>
  );
}
