import { useMemo } from 'react';
import { TOPICS } from '@/data/content';
import type { AppData } from '@/lib/useAppData';
import { topicLabel } from '@/lib/recommendations';
import { ChevronLeft } from 'lucide-react';

type Props = {
  data: AppData;
  onBack: () => void;
  onOpenTopic: (t: string) => void;
};

export function DashboardScreen({ data, onBack, onOpenTopic }: Props) {
  const { progress, attempts, recs } = data;

  const rows = useMemo(
    () =>
      TOPICS.map((t, i) => {
        const p = progress[t.id];
        const topicAttempts = attempts[i] ?? [];
        const best = p?.best_score ?? 0;
        const last = p?.last_score ?? 0;
        const count = topicAttempts.length;
        return { id: t.id, title: t.title, best, last, count };
      }),
    [progress, attempts],
  );

  const allAttempts = attempts.flat().sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );

  const strengths = rows.filter((r) => r.best >= 70);
  const weak = rows.filter((r) => r.best > 0 && r.best < 40);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button
        onClick={onBack}
        className="text-sm text-[var(--muted)] mb-4 inline-flex items-center gap-1"
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl">Your progress</h1>
      <p className="text-sm text-[var(--muted)] mt-1 mb-6">
        Quiz scores and attempt history across all topics.
      </p>

      <section>
        <p className="label mb-3">Scores by topic</p>
        <div className="space-y-3">
          {rows.map((r) => (
            <button
              key={r.id}
              onClick={() => onOpenTopic(r.id)}
              className="card w-full text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{r.title}</span>
                <span className="text-xs text-[var(--muted)]">
                  Best {r.best}% · {r.count} {r.count === 1 ? 'attempt' : 'attempts'}
                </span>
              </div>
              <div className="h-2 bg-[var(--bg)] rounded mt-2 overflow-hidden">
                <div
                  className="h-2 bg-[var(--ink)]"
                  style={{ width: `${r.best}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        <div className="card">
          <p className="label mb-2">Strengths</p>
          {strengths.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No strong topics yet.</p>
          ) : (
            <ul className="text-sm space-y-1">
              {strengths.map((s) => (
                <li key={s.id}>{s.title} — {s.best}%</li>
              ))}
            </ul>
          )}
        </div>
        <div className="card">
          <p className="label mb-2">Weak areas</p>
          {weak.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No weak topics identified.</p>
          ) : (
            <ul className="text-sm space-y-1">
              {weak.map((s) => (
                <li key={s.id}>{s.title} — {s.best}%</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {recs.recommendations.length > 0 && (
        <section className="mt-6">
          <p className="label mb-2">Performance-based recommendations</p>
          <div className="space-y-2">
            {recs.recommendations.map((r) => (
              <div key={r.topic} className="card">
                <p className="text-sm font-medium">{topicLabel(r.topic)}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{r.reason}</p>
                <ol className="mt-2 text-sm space-y-1">
                  {r.steps.map((s, i) => (
                    <li key={i}>{i + 1}. {s}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-6">
        <p className="label mb-2">Attempt history</p>
        {allAttempts.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No attempts yet.</p>
        ) : (
          <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="bg-[var(--bg)]">
                <tr className="text-left text-[var(--muted)]">
                  <th className="px-3 py-2 font-medium">Topic</th>
                  <th className="px-3 py-2 font-medium">Score</th>
                  <th className="px-3 py-2 font-medium">Attempt</th>
                  <th className="px-3 py-2 font-medium">Synced</th>
                </tr>
              </thead>
              <tbody>
                {allAttempts.slice(0, 20).map((a) => (
                  <tr key={a.id} className="border-t border-[var(--line)]">
                    <td className="px-3 py-2">{topicLabel(a.topic)}</td>
                    <td className="px-3 py-2">{a.score_percent}%</td>
                    <td className="px-3 py-2">#{a.attempt_no}</td>
                    <td className="px-3 py-2 text-[var(--muted)]">
                      {a.synced === 1 ? 'Yes' : 'Pending'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
