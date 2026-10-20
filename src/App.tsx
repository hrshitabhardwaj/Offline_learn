import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { AuthProvider, useAuth } from '@/lib/auth';
import { ToastProvider, useToast } from '@/components/Toast';
import { useConnection } from '@/lib/useConnection';
import { useAppData } from '@/lib/useAppData';
import { TopBar } from '@/components/TopBar';
import { OfflineBanner } from '@/components/OfflineBanner';
import { SettingsModal } from '@/components/SettingsModal';
import { AuthScreen } from '@/screens/AuthScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { TopicScreen } from '@/screens/TopicScreen';
import { LessonScreen } from '@/screens/LessonScreen';
import { PracticeScreen, AssessmentScreen } from '@/screens/QuizScreens';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { EvaluationScreen } from '@/screens/EvaluationScreen';
import {
  enqueueAttempt,
  upsertProgress,
  loadRemoteAttempts,
  loadRemoteProgress,
  syncQueue,
} from '@/lib/sync';
import { db } from '@/lib/db';
import { TOPIC_IDS } from '@/data/content';
import { I18nProvider, useI18n } from '@/lib/i18n';

type View =
  | { name: 'home' }
  | { name: 'topic'; topic: string }
  | { name: 'lesson'; topic: string; lessonId: string }
  | { name: 'practice'; topic: string; set: 'practice' | 'basic' | 'advanced' }
  | { name: 'assessment'; topic: string }
  | { name: 'dashboard' }
  | { name: 'evaluation' };

function Shell() {
  const { user, loading } = useAuth();
  const { t, isIndic, lang } = useI18n();
  const toast = useToast();
  const [simulateOffline, setSimulateOffline] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [view, setView] = useState<View>({ name: 'home' });

  const onOnline = useCallback(() => {
    if (!user) return;
    void (async () => {
      const result = await syncQueue(user.id);
      if (result.pushed > 0) toast.show(t('recordsSynced', { count: result.pushed }));
    })();
  }, [user, toast, t]);

  const conn = useConnection({ simulateOffline, onOnline });
  const data = useAppData(conn.isOnline, lang);

  useDemoSeed(user?.id ?? null, data.refresh, t);

  // Apply language class to body for Indic font styling
  useEffect(() => {
    document.body.classList.toggle('lang-indic', isIndic);
  }, [isIndic]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-[var(--muted)]">{t('loading')}</p>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  const openTopic = (topic: string) => setView({ name: 'topic', topic });

  return (
    <div className="min-h-screen">
      <TopBar
        status={conn.status}
        onSync={async () => {
          conn.setStatus('syncing');
          const r = await data.runSync();
          conn.setStatus(conn.isOnline ? 'online' : 'offline');
          if (r) {
            toast.show(
              r.pushed > 0
                ? t('recordsSynced', { count: r.pushed })
                : t('nothingToSync'),
            );
          }
        }}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <OfflineBanner show={conn.status === 'offline'} />

      <main className="pb-24">
        {view.name === 'home' && (
          <HomeScreen
            data={data}
            connectionOnline={conn.isOnline}
            onOpenTopic={openTopic}
            onOpenDashboard={() => setView({ name: 'dashboard' })}
          />
        )}
        {view.name === 'topic' && (
          <TopicScreen
            topic={view.topic}
            data={data}
            online={conn.isOnline}
            onBack={() => setView({ name: 'home' })}
            onOpenLesson={(lessonId) =>
              setView({ name: 'lesson', topic: view.topic, lessonId })
            }
            onOpenPractice={(set) =>
              setView({ name: 'practice', topic: view.topic, set })
            }
            onOpenAssessment={() =>
              setView({ name: 'assessment', topic: view.topic })
            }
            onVideoOpened={data.recordVideoOpened}
          />
        )}
        {view.name === 'lesson' && (
          <LessonScreen
            topic={view.topic}
            lessonId={view.lessonId}
            data={data}
            online={conn.isOnline}
            onBack={() => setView({ name: 'topic', topic: view.topic })}
            onDone={() => {
              setView({ name: 'topic', topic: view.topic });
            }}
            onVideoOpened={data.recordVideoOpened}
          />
        )}
        {view.name === 'practice' && (
          <PracticeScreen
            topic={view.topic}
            set={view.set}
            data={data}
            onExit={() => setView({ name: 'topic', topic: view.topic })}
          />
        )}
        {view.name === 'assessment' && (
          <AssessmentScreen
            topic={view.topic}
            data={data}
            onExit={() => setView({ name: 'topic', topic: view.topic })}
          />
        )}
        {view.name === 'dashboard' && (
          <DashboardScreen
            data={data}
            onBack={() => setView({ name: 'home' })}
            onOpenTopic={openTopic}
          />
        )}
        {view.name === 'evaluation' && (
          <EvaluationScreen data={data} onBack={() => setView({ name: 'home' })} />
        )}
      </main>

      <BottomNav
        current={view.name}
        onHome={() => setView({ name: 'home' })}
        onDashboard={() => setView({ name: 'dashboard' })}
        onEvaluation={() => setView({ name: 'evaluation' })}
      />

      <SettingsModal
        open={settingsOpen}
        simulateOffline={simulateOffline}
        onToggleSimulate={setSimulateOffline}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

function BottomNav({
  current,
  onHome,
  onDashboard,
  onEvaluation,
}: {
  current: string;
  onHome: () => void;
  onDashboard: () => void;
  onEvaluation: () => void;
}) {
  const { t } = useI18n();
  const items = [
    { id: 'home', label: t('home'), onClick: onHome },
    { id: 'dashboard', label: t('progress'), onClick: onDashboard },
    { id: 'evaluation', label: t('demo'), onClick: onEvaluation },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[var(--bg)] border-t border-[var(--line)]">
      <div className="max-w-3xl mx-auto grid grid-cols-3">
        {items.map((it) => {
          const active =
            current === it.id ||
            (it.id === 'home' && ['topic', 'lesson', 'practice', 'assessment'].includes(current));
          return (
            <button
              key={it.id}
              onClick={it.onClick}
              className={`py-3 text-xs font-medium ${
                active ? 'text-[var(--ink)]' : 'text-[var(--muted)]'
              }`}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

const seeded = new Set<string>();

function useDemoSeed(
  userId: string | null,
  refresh: () => Promise<void>,
  t: (k: 'demoDataLoaded') => string,
) {
  const toast = useToast();
  const memo = useMemo(() => userId, [userId]);
  if (!memo) return;
  if (seeded.has(memo)) return;
  seeded.add(memo);
  void (async () => {
    const existing = await db.attempts.where('user_id').equals(memo).count();
    if (existing > 0) return;
    const remoteAttemptCount = await (async () => {
      try {
        await loadRemoteAttempts(memo);
        await loadRemoteProgress(memo);
      } catch {
        /* ignore */
      }
      return await db.attempts.where('user_id').equals(memo).count();
    })();
    if (remoteAttemptCount > 0) {
      await refresh();
      return;
    }

    const demo = [
      { topic: 'fractions', score: 35 },
      { topic: 'algebra', score: 82 },
      { topic: 'geometry', score: 74 },
    ];
    for (const d of demo) {
      const total = 10;
      const correct = Math.round((d.score / 100) * total);
      const clientId = uuid();
      await enqueueAttempt({
        id: clientId,
        user_id: memo,
        topic: d.topic,
        score_percent: d.score,
        correct,
        total,
        attempt_no: 1,
        created_at: new Date().toISOString(),
        synced: 0,
      });
      const status =
        d.score < 40 ? 'weak' : d.score <= 70 ? 'needs-practice' : 'good';
      await upsertProgress(memo, d.topic, {
        completed_lessons: 2,
        best_score: d.score,
        last_score: d.score,
        status,
      });
    }
    // mark topics as downloaded in English for demo convenience
    for (const topic of TOPIC_IDS) {
      await db.downloads.put({
        user_id: memo,
        topic,
        lang: 'en',
        downloaded_at: new Date().toISOString(),
      });
    }
    await refresh();
    toast.show(t('demoDataLoaded'));
  })();
}

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <ToastProvider>
          <Shell />
        </ToastProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
