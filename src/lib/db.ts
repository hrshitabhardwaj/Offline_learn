import Dexie, { type Table } from 'dexie';

export type LocalAttempt = {
  id: string; // client_id (uuid)
  user_id: string;
  topic: string;
  score_percent: number;
  correct: number;
  total: number;
  attempt_no: number;
  created_at: string;
  synced: 0 | 1; // 0 = pending sync
};

export type LocalProgress = {
  user_id: string;
  topic: string;
  completed_lessons: number;
  best_score: number;
  last_score: number;
  status: string;
  updated_at: string;
  dirty: 0 | 1; // 1 = needs sync
};

export type SyncQueueItem = {
  id?: number;
  kind: 'attempt' | 'progress';
  client_id: string;
  user_id: string;
  payload: Record<string, unknown>;
  created_at: string;
  retries: number;
};

export type DownloadedTopic = {
  user_id: string;
  topic: string;
  lang: string; // language code of the downloaded content pack
  downloaded_at: string;
};

export type RelevanceVote = {
  id?: number;
  user_id: string;
  topic: string;
  recommendation: string;
  relevant: 1 | 0;
  created_at: string;
  synced: 0 | 1;
};

export class OfflineLearnDB extends Dexie {
  attempts!: Table<LocalAttempt, string>;
  progress!: Table<LocalProgress, string>;
  syncQueue!: Table<SyncQueueItem, number>;
  downloads!: Table<DownloadedTopic, string>;
  relevance!: Table<RelevanceVote, number>;

  constructor() {
    super('offlinelearn');
    this.version(1).stores({
      attempts: 'id, user_id, topic, synced',
      progress: '[user_id+topic], user_id, topic, dirty',
      syncQueue: '++id, kind, client_id, user_id, created_at',
      downloads: '[user_id+topic], user_id, topic',
      relevance: '++id, user_id, topic, synced',
    });
    // v2: downloads now track language per topic pack
    this.version(2).stores({
      attempts: 'id, user_id, topic, synced',
      progress: '[user_id+topic], user_id, topic, dirty',
      syncQueue: '++id, kind, client_id, user_id, created_at',
      downloads: '[user_id+topic+lang], user_id, topic, lang',
      relevance: '++id, user_id, topic, synced',
    });
  }
}

export const db = new OfflineLearnDB();
