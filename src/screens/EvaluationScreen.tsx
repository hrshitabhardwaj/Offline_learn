import type { AppData } from '@/lib/useAppData';
import { topicLabel } from '@/lib/recommendations';
import { ChevronLeft, ThumbsUp, ThumbsDown } from 'lucide-react';

type Props = {
  data: AppData;
  onBack: () => void;
};

export function EvaluationScreen({ data, onBack }: Props) {
  const { syncStats, recs, relevanceVotes, addRelevanceVote, runSync, attempts } = data;

  const offlineTopicsDone = Object.values(data.progress).filter(
    (p) => p && (p.completed_lessons > 0 || p.last_score > 0),
  ).length;

  const recordsNeedingSync = syncStats.pending + syncStats.synced;
  const syncSuccessRate =
    recordsNeedingSync === 0
      ? 100
      : Math.round((syncStats.synced / recordsNeedingSync) * 100);

  const totalVotes = Object.keys(relevanceVotes).length;
  const relevantVotes = Object.values(relevanceVotes).filter((v) => v === 1).length;
  const relevancePct =
    totalVotes === 0 ? 0 : Math.round((relevantVotes / totalVotes) * 100);

  const allAttempts = attempts.flat();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button
        onClick={onBack}
        className="text-sm text-[var(--muted)] mb-4 inline-flex items-center gap-1"
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl">Evaluation panel</h1>
      <p className="text-sm text-[var(--muted)] mt-1 mb-6">
        Demo metrics for offline behaviour, sync, and recommendation relevance.
      </p>

      <section className="grid grid-cols-2 gap-3">
        <Metric label="Offline topics touched" value={`${offlineTopicsDone}`} />
        <Metric
          label="Sync success rate"
          value={`${syncSuccessRate}%`}
          sub={`${syncStats.synced}/${recordsNeedingSync} records`}
        />
        <Metric
          label="Data used this session"
          value={`${Math.max(syncStats.sessionBytes, 0)} B`}
          sub={`~${(Math.max(syncStats.sessionBytes, 0) / 1024).toFixed(1)} KB`}
        />
        <Metric
          label="Pending sync"
          value={`${syncStats.pending}`}
          sub="queued records"
        />
      </section>

      <section className="card mt-5">
        <p className="label mb-1">Sync attempts</p>
        <p className="text-sm">
          {syncStats.syncSuccesses}/{syncStats.syncAttempts} successful
        </p>
        <button className="btn-ghost btn-sm mt-3" onClick={() => void runSync()}>
          Sync now
        </button>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <p className="label">Recommendations ({recs.recommendations.length})</p>
          <span className="text-xs text-[var(--muted)]">
            Relevance: {relevancePct}% ({relevantVotes}/{totalVotes})
          </span>
        </div>
        {recs.recommendations.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            No recommendations yet. Take a quiz to generate one.
          </p>
        ) : (
          <div className="space-y-2">
            {recs.recommendations.map((r) => {
              const key = `${r.topic}:${r.reason}`;
              const vote = relevanceVotes[key];
              return (
                <div key={key} className="card">
                  <p className="text-sm font-medium">{topicLabel(r.topic)}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">{r.reason}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    Level: {r.statusLabel}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-[var(--muted)] mr-1">
                      Was this relevant?
                    </span>
                    <button
                      className={`btn-sm btn-ghost ${vote === 1 ? '!border-[var(--ink)]' : ''}`}
                      onClick={() => void addRelevanceVote(r.topic, r.reason, 1)}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" strokeWidth={1.8} /> Yes
                    </button>
                    <button
                      className={`btn-sm btn-ghost ${vote === 0 ? '!border-[var(--ink)]' : ''}`}
                      onClick={() => void addRelevanceVote(r.topic, r.reason, 0)}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" strokeWidth={1.8} /> No
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-6">
        <p className="label mb-2">Local records</p>
        <p className="text-sm text-[var(--muted)]">
          {allAttempts.length} attempts stored on this device.
        </p>
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="card">
      <p className="label">{label}</p>
      <p className="text-2xl mt-1">{value}</p>
      {sub && <p className="text-xs text-[var(--muted)] mt-0.5">{sub}</p>}
    </div>
  );
}
