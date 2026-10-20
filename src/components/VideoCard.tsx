import { useState } from 'react';
import { resolveVideos, youtubeIdFromUrl, type VideoRef } from '@/data/videos';
import { LANGUAGES, type Lang, useI18n } from '@/lib/i18n';
import { Play, ExternalLink, WifiOff } from 'lucide-react';

type Props = {
  topicId: string;
  online: boolean;
  onOpened: () => void;
};

export function VideoCard({ topicId, online, onOpened }: Props) {
  const { lang, t } = useI18n();
  const [opened, setOpened] = useState(false);

  const { videos, resolvedLang } = resolveVideos(topicId, lang);
  if (videos.length === 0) return null;

  const first = videos[0];
  const id = youtubeIdFromUrl(first.url);
  const resolvedNativeName =
    LANGUAGES.find((l) => l.code === resolvedLang)?.nativeName ?? '';

  const handleWatch = () => {
    if (!online) return;
    setOpened(true);
    onOpened();
  };

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-2">
        <p className="label">{t('referenceVideo')}</p>
        <span className="text-xs text-[var(--muted)]">{first.source}</span>
      </div>
      <p className="text-sm font-medium">{first.title}</p>
      <div className="flex flex-wrap gap-2 mt-2 text-xs text-[var(--muted)]">
        <span className="border border-[var(--line)] rounded-full px-2 py-0.5">
          {t('videoLanguage')}: {resolvedNativeName}
        </span>
        <span className="border border-[var(--line)] rounded-full px-2 py-0.5">
          {t('usesMobileData')}
        </span>
      </div>

      {!online && (
        <p className="text-xs text-[var(--muted)] mt-3 flex items-center gap-1.5">
          <WifiOff className="w-3.5 h-3.5" strokeWidth={1.7} />
          {t('videoNeedsInternet')}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          className="btn-ghost btn-sm"
          disabled={!online}
          onClick={handleWatch}
        >
          <Play className="w-3.5 h-3.5" strokeWidth={1.8} />
          {t('watchVideo')}
        </button>
        {online && id && (
          <a
            href={`https://www.youtube.com/watch?v=${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--muted)] underline underline-offset-4 inline-flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" strokeWidth={1.7} />
            {t('openInYouTube')}
          </a>
        )}
      </div>

      {opened && id && (
        <div className="mt-3 rounded-md overflow-hidden border border-[var(--line)]">
          <iframe
            key={id}
            className="w-full aspect-video"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0&modestbranding=1`}
            title={first.title}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      )}
    </section>
  );
}
