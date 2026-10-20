import { useCallback, useEffect, useState } from 'react';
import { db, type LocalAttempt, type LocalProgress } from './db';
import { useAuth } from './auth';
import {
  buildRecommendations,
  type Recommendation,
  type RecommendationsResult,
  type TopicScore,
} from './recommendations';
import { TOPIC_IDS } from '@/data/content';
import { syncQueue, loadRemoteAttempts, loadRemoteProgress } from './sync';
import type { Lang } from './i18n';

export type ProgressMap = Record<string, LocalProgress>;
export type AttemptList = LocalAttempt[];
export type DownloadMap = Record<string, Set<string>>; // topicId -> set of langs

export function useAppData(connectionOnline: boolean, lang: Lang) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [progress, setProgress] = useState<ProgressMap>({});
  const [attempts, setAttempts] = useState<AttemptList[]>([]);
  const [downloads, setDownloads] = useState<DownloadMap>({});
  const [recs, setRecs] = useState<RecommendationsResult>({
    recommendations: [],
    nextTopic: null,
  });
  const [syncStats, setSyncStats] = useState({
    synced: 0,
    pending: 0,
    syncAttempts: 0,
    syncSuccesses: 0,
    sessionBytes: 0,
  });
  const [relevanceVotes, setRelevanceVotes] = useState<
    Record<string, 1 | 0>
  >({});
  const [videosOpened, setVideosOpened] = useState(0);

  const refresh = useCallback(async () => {
    if (!userId) return;
    const allProgress = await db.progress.where('user_id').equals(userId).toArray();
    const map: ProgressMap = {};
    for (const p of allProgress) map[p.topic] = p;
    setProgress(map);

    const allAttempts = await db.attempts.where('user_id').equals(userId).toArray();
    const grouped: AttemptList[] = TOPIC_IDS.map((t) =>
      allAttempts.filter((a) => a.topic === t).sort((x, y) => x.attempt_no - y.attempt_no),
    );
    setAttempts(grouped);

    const dls = await db.downloads.where('user_id').equals(userId).toArray();
    const dlMap: DownloadMap = {};
    for (const d of dls) {
      if (!dlMap[d.topic]) dlMap[d.topic] = new Set();
      dlMap[d.topic].add(d.lang);
    }
    setDownloads(dlMap);

    const scores: TopicScore[] = TOPIC_IDS.map((t, i) => {
      const topicAttempts = grouped[i];
      const latest = topicAttempts[topicAttempts.length - 1];
      return { topic: t, scorePercent: latest ? latest.score_percent : -1 };
    }).filter((s) => s.scorePercent >= 0);

    const completed = TOPIC_IDS.filter((t) => {
      const p = map[t];
      return p && (p.status === 'good' || p.status === 'Good');
    });

    const result = buildRecommendations(scores, completed);
    setRecs(result);

    const pending = await db.syncQueue.where('user_id').equals(userId).count();
    const synced = await db.attempts
      .where('user_id')
      .equals(userId)
      .filter((a) => a.synced === 1)
      .count();
    setSyncStats((s) => ({ ...s, synced, pending }));
  }, [userId]);

  useEffect(() => {
    if (userId) void refresh();
  }, [userId, refresh]);

  // Pull remote data when online (session bootstrap)
  useEffect(() => {
    if (!userId || !connectionOnline) return;
    (async () => {
      await loadRemoteAttempts(userId);
      await loadRemoteProgress(userId);
      await refresh();
    })();
  }, [userId, connectionOnline, refresh]);

  const markDownloaded = useCallback(
    async (topic: string, downloadLang: Lang) => {
      if (!userId) return;
      await db.downloads.put({
        user_id: userId,
        topic,
        lang: downloadLang,
        downloaded_at: new Date().toISOString(),
      });
      await refresh();
    },
    [userId, refresh],
  );

  const addRelevanceVote = useCallback(
    async (topic: string, recommendation: string, relevant: 1 | 0) => {
      if (!userId) return;
      await db.relevance.add({
        user_id: userId,
        topic,
        recommendation,
        relevant,
        created_at: new Date().toISOString(),
        synced: 0,
      });
      setRelevanceVotes((prev) => ({ ...prev, [`${topic}:${recommendation}`]: relevant }));
    },
    [userId],
  );

  const runSync = useCallback(async () => {
    if (!userId || !connectionOnline) return null;
    const before = await db.syncQueue.where('user_id').equals(userId).count();
    if (before === 0) return { pushed: 0, failed: 0 };
    const bytes = before * 380; // rough estimate per record
    const result = await syncQueue(userId);
    setSyncStats((s) => ({
      ...s,
      syncAttempts: s.syncAttempts + 1,
      syncSuccesses: s.syncSuccesses + (result.failed === 0 ? 1 : 0),
      sessionBytes: s.sessionBytes + bytes,
    }));
    await refresh();
    return result;
  }, [userId, connectionOnline, refresh]);

  const recordVideoOpened = useCallback(() => {
    setVideosOpened((n) => n + 1);
  }, []);

  return {
    progress,
    attempts,
    downloads,
    recs,
    syncStats,
    relevanceVotes,
    videosOpened,
    refresh,
    markDownloaded,
    addRelevanceVote,
    runSync,
    recordVideoOpened,
  };
}

export type AppData = ReturnType<typeof useAppData>;
