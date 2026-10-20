import { db } from './db';
import { supabase } from './supabase';
import type { LocalAttempt, LocalProgress, SyncQueueItem } from './db';

export type SyncResult = {
  pushed: number;
  failed: number;
};

async function pushAttempt(item: SyncQueueItem): Promise<boolean> {
  const { error } = await supabase.from('attempts').upsert(
    {
      id: item.payload.id as string,
      user_id: item.user_id,
      topic: item.payload.topic as string,
      score_percent: item.payload.score_percent as number,
      correct: item.payload.correct as number,
      total: item.payload.total as number,
      attempt_no: item.payload.attempt_no as number,
      client_id: item.client_id,
      created_at: item.payload.created_at as string,
    },
    { onConflict: 'client_id' },
  );
  if (error) return false;
  await db.attempts.update(item.client_id, { synced: 1 });
  return true;
}

async function pushProgress(item: SyncQueueItem): Promise<boolean> {
  const { error } = await supabase.from('progress').upsert(
    {
      user_id: item.user_id,
      topic: item.payload.topic as string,
      completed_lessons: item.payload.completed_lessons as number,
      best_score: item.payload.best_score as number,
      last_score: item.payload.last_score as number,
      status: item.payload.status as string,
      updated_at: item.payload.updated_at as string,
    },
    { onConflict: 'user_id,topic' },
  );
  if (error) return false;
  await db.progress
    .where('[user_id+topic]')
    .equals([item.user_id, item.payload.topic as string])
    .modify({ dirty: 0 });
  return true;
}

export async function syncQueue(user_id: string): Promise<SyncResult> {
  const queued = await db.syncQueue.where('user_id').equals(user_id).toArray();
  let pushed = 0;
  let failed = 0;

  for (const item of queued) {
    let ok = false;
    try {
      if (item.kind === 'attempt') ok = await pushAttempt(item);
      else if (item.kind === 'progress') ok = await pushProgress(item);
    } catch {
      ok = false;
    }

    if (ok) {
      if (item.id != null) await db.syncQueue.delete(item.id);
      pushed += 1;
    } else {
      failed += 1;
      if (item.id != null) {
        await db.syncQueue.update(item.id, { retries: item.retries + 1 });
      }
    }
  }

  await pushRelevance(user_id);

  return { pushed, failed };
}

async function pushRelevance(user_id: string): Promise<void> {
  const pending = await db.relevance
    .where('user_id')
    .equals(user_id)
    .filter((r) => r.synced === 0)
    .toArray();
  for (const r of pending) {
    const { error } = await supabase.from('relevance').insert({
      user_id: r.user_id,
      topic: r.topic,
      recommendation: r.recommendation,
      relevant: r.relevant,
      created_at: r.created_at,
    });
    if (!error && r.id != null) {
      await db.relevance.update(r.id, { synced: 1 });
    }
  }
}

export async function enqueueAttempt(a: LocalAttempt): Promise<void> {
  await db.attempts.put(a);
  await db.syncQueue.add({
    kind: 'attempt',
    client_id: a.id,
    user_id: a.user_id,
    payload: { ...a },
    created_at: new Date().toISOString(),
    retries: 0,
  });
}

export async function upsertProgress(
  user_id: string,
  topic: string,
  patch: Partial<LocalProgress>,
): Promise<void> {
  const existing = await db.progress
    .where('[user_id+topic]')
    .equals([user_id, topic])
    .first();
  const updatedAt = new Date().toISOString();
  const next: LocalProgress = {
    user_id,
    topic,
    completed_lessons: existing?.completed_lessons ?? 0,
    best_score: existing?.best_score ?? 0,
    last_score: existing?.last_score ?? 0,
    status: existing?.status ?? 'not-started',
    updated_at: updatedAt,
    dirty: 1,
    ...patch,
  };
  await db.progress.put(next);
  await db.syncQueue.add({
    kind: 'progress',
    client_id: `${user_id}:${topic}`,
    user_id,
    payload: { ...next },
    created_at: updatedAt,
    retries: 0,
  });
}

export async function loadRemoteAttempts(user_id: string): Promise<void> {
  const { data, error } = await supabase
    .from('attempts')
    .select('*')
    .eq('user_id', user_id);
  if (error || !data) return;
  for (const a of data) {
    const local: LocalAttempt = {
      id: a.client_id,
      user_id: a.user_id,
      topic: a.topic,
      score_percent: a.score_percent,
      correct: a.correct,
      total: a.total,
      attempt_no: a.attempt_no,
      created_at: a.created_at,
      synced: 1,
    };
    await db.attempts.put(local);
  }
}

export async function loadRemoteProgress(user_id: string): Promise<void> {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', user_id);
  if (error || !data) return;
  for (const p of data) {
    await db.progress.put({
      user_id: p.user_id,
      topic: p.topic,
      completed_lessons: p.completed_lessons,
      best_score: p.best_score,
      last_score: p.last_score,
      status: p.status,
      updated_at: p.updated_at,
      dirty: 0,
    });
  }
}
