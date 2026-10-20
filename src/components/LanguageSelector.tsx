import { LANGUAGES, type Lang, useI18n } from '@/lib/i18n';
import { Globe } from 'lucide-react';

type Props = {
  compact?: boolean;
};

export function LanguageSelector({ compact = false }: Props) {
  const { lang, setLang } = useI18n();
  return (
    <label className={`inline-flex items-center gap-1.5 ${compact ? '' : 'text-sm'}`}>
      <Globe className="w-4 h-4 text-[var(--muted)]" strokeWidth={1.7} />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        aria-label="Language"
        className={`bg-transparent border border-[var(--line)] rounded-md px-2 py-1.5 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--ink)] min-h-[36px]`}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}
