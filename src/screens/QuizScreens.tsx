import { useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { TOPICS } from '@/data/content';
import type { AppData } from '@/lib/useAppData';
import { useAuth } from '@/lib/auth';
import { QuizRunner } from '@/components/QuizRunner';
import { enqueueAttempt, upsertProgress } from '@/lib/sync';
import { classifyScore } from '@/lib/recommendations';

type Props = {
  topic: string;
  set: 'practice' | 'basic' | 'advanced';
  data: AppData;
  onExit: () => void;
};

export function PracticeScreen({ topic, set, data, onExit }: Props) {
  const { user } = useAuth();
  const t = useMemo(() => TOPICS.find((x) => x.id === topic)!, [topic]);
  const questions = t[set];

  const titleMap = {
    practice: 'Practice questions',
    basic: 'Basic practice set',
    advanced: 'Advanced practice set',
  } as const;

  return (
    <QuizRunner
      title={titleMap[set]}
      subtitle="Practice"
      questions={questions}
      topic={t.title}
      variant="practice"
      onExit={onExit}
      onSubmit={async ({ correct, total }) => {
        if (!user) return;
        // Practice is not scored into attempts, but we record light progress.
        const pct = Math.round((correct / total) * 100);
        const existing = data.progress[topic];
        if (set === 'practice' && (!existing || existing.completed_lessons >= t.lessons.length)) {
          await upsertProgress(user.id, topic, {
            status: existing?.status ?? 'in-progress',
          });
        }
        void pct;
        await data.refresh();
        onExit();
      }}
    />
  );
}

export function AssessmentScreen({
  topic,
  data,
  onExit,
}: {
  topic: string;
  data: AppData;
  onExit: () => void;
}) {
  const { user } = useAuth();
  const t = useMemo(() => TOPICS.find((x) => x.id === topic)!, [topic]);
  const questions = t.assessment;

  return (
    <QuizRunner
      title="Assessment"
      subtitle="Quiz"
      questions={questions}
      topic={t.title}
      variant="assessment"
      timed
      onExit={onExit}
      onSubmit={async ({ correct, total, answers }) => {
        if (!user) return;
        const pct = Math.round((correct / total) * 100);
        const topicAttempts = data.attempts.find((a, i) => TOPICS[i]?.id === topic) ?? [];
        const attemptNo = (topicAttempts[topicAttempts.length - 1]?.attempt_no ?? 0) + 1;
        const clientId = uuid();
        const { level } = classifyScore(pct);
        const existing = data.progress[topic];
        const best = Math.max(existing?.best_score ?? 0, pct);
        await enqueueAttempt({
          id: clientId,
          user_id: user.id,
          topic,
          score_percent: pct,
          correct,
          total,
          attempt_no: attemptNo,
          created_at: new Date().toISOString(),
          synced: 0,
        });
        await upsertProgress(user.id, topic, {
          completed_lessons: existing?.completed_lessons ?? 0,
          best_score: best,
          last_score: pct,
          status: level === 'good' ? 'good' : level === 'weak' ? 'weak' : 'needs-practice',
        });
        await data.refresh();
        void answers;
      }}
    />
  );
}
