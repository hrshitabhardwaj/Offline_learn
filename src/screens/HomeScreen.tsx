import { useAuth } from '@/lib/auth';
import type { AppData } from '@/lib/useAppData';
import { TOPICS, TOPICS_BY_ID } from '@/data/content';
import { getTopicContent, TOPIC_TITLES, TOPIC_DESCS } from '@/data/contentI18n';
import { useI18n } from '@/lib/i18n';
import {
  Check,
  ChevronRight,
  CloudDownload,
  Sparkles,
  Target,
} from 'lucide-react';

type Props = {
  data: AppData;
  connectionOnline: boolean;
  onOpenTopic: (topic: string) => void;
  onOpenDashboard: () => void;
};

export function HomeScreen({ data, connectionOnline, onOpenTopic, onOpenDashboard }: Props) {
  const { displayName } = useAuth();
  const { lang, t } = useI18n();
  const { progress, downloads, recs, markDownloaded } = data;
  const topRec = recs.recommendations[0];

  const downloadNativeName = (code: string) => {
    const l = ({ en: 'English', hi: 'हिन्दी', bn: 'বাংলা', mr: 'मराठी', te: 'తెలుగు', ta: 'தமிழ்' } as Record<string, string>)[code];
    return l ?? code;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <section>
        <p className="label">{t('hello')}</p>
        <h1 className="text-2xl">{displayName}</h1>
        <p className="text-sm text-[var(--muted)] mt-1">{t('greeting')}</p>
      </section>

      {topRec && (
        <section className="card border-[var(--ink)]/30">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" strokeWidth={1.7} />
            <p className="label">{t('recommendedForYou')}</p>
          </div>
          <p className="text-base font-medium">{topRec.headline}</p>
          <p className="text-sm text-[var(--muted)] mt-1">{topRec.reason}</p>
          <ol className="mt-3 space-y-1.5 text-sm">
            {topRec.steps.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[var(--muted)] w-4">{i + 1}.</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <button
            className="btn-primary btn-sm mt-4"
            onClick={() => onOpenTopic(topRec.topic)}
          >
            {t('goTo')} {TOPIC_TITLES[lang]?.[topRec.topic] ?? topRec.topic}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg">{t('topics')}</h2>
          <button
            className="text-sm text-[var(--muted)] underline underline-offset-4"
            onClick={onOpenDashboard}
          >
            {t('viewProgress')}
          </button>
        </div>
        <div className="space-y-3">
          {TOPICS.map((base) => {
            const tc = getTopicContent(base.id, lang, TOPICS_BY_ID[base.id]);
            const p = progress[base.id];
            const topicDownloads = downloads[base.id] ?? new Set();
            const hasCurrentLang = topicDownloads.has(lang);
            const hasAnyLang = topicDownloads.size > 0;
            const status = p?.status ?? 'not-started';
            const score = p?.best_score ?? 0;
            return (
              <article key={base.id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <button
                    className="text-left flex-1"
                    onClick={() => onOpenTopic(base.id)}
                  >
                    <p className="text-base font-medium">{tc.title}</p>
                    <p className="text-sm text-[var(--muted)] mt-0.5">{tc.desc}</p>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs text-[var(--muted)]">
                      <span className="border border-[var(--line)] rounded-full px-2 py-0.5 capitalize">
                        {status.replace('-', ' ')}
                      </span>
                      {p && p.best_score > 0 && (
                        <span className="border border-[var(--line)] rounded-full px-2 py-0.5">
                          {t('best')} {score}%
                        </span>
                      )}
                    </div>
                  </button>
                  <div className="flex flex-col items-end gap-2">
                    {hasCurrentLang ? (
                      <span className="inline-flex items-center gap-1 text-xs text-[var(--ink)]">
                        <Check className="w-3.5 h-3.5" strokeWidth={2} />
                        {t('availableOffline')} · {downloadNativeName(lang)}
                      </span>
                    ) : (
                      <button
                        className="btn-ghost btn-sm"
                        disabled={!connectionOnline}
                        onClick={async () => {
                          await markDownloaded(base.id, lang);
                        }}
                      >
                        <CloudDownload className="w-3.5 h-3.5" strokeWidth={1.8} />
                        {hasAnyLang
                          ? `${t('downloadIn')} ${downloadNativeName(lang)}`
                          : t('download')}
                      </button>
                    )}
                    <button
                      className="text-[var(--muted)]"
                      onClick={() => onOpenTopic(base.id)}
                      aria-label={`Open ${tc.title}`}
                    >
                      <ChevronRight className="w-5 h-5" strokeWidth={1.7} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="card flex items-center gap-3">
        <Target className="w-5 h-5" strokeWidth={1.7} />
        <p className="text-sm text-[var(--muted)]">{t('downloadTip')}</p>
      </section>
    </div>
  );
}
