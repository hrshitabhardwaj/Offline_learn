import { WifiOff, Wifi, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { LanguageSelector } from '@/components/LanguageSelector';

type Props = {
  open: boolean;
  simulateOffline: boolean;
  onToggleSimulate: (v: boolean) => void;
  onClose: () => void;
};

export function SettingsModal({
  open,
  simulateOffline,
  onToggleSimulate,
  onClose,
}: Props) {
  const { t } = useI18n();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-end sm:items-center justify-center">
      <div className="bg-[var(--bg)] w-full sm:max-w-sm rounded-t-lg sm:rounded-lg border border-[var(--line)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg">{t('settings')}</h2>
          <button onClick={onClose} aria-label="Close" className="text-[var(--muted)]">
            <X className="w-5 h-5" strokeWidth={1.7} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="card flex items-center justify-between gap-3">
            <span className="text-sm">{t('language')}</span>
            <LanguageSelector />
          </div>

          <label className="flex items-center justify-between gap-3 card">
            <span className="flex items-center gap-2 text-sm">
              {simulateOffline ? (
                <WifiOff className="w-4 h-4" strokeWidth={1.7} />
              ) : (
                <Wifi className="w-4 h-4" strokeWidth={1.7} />
              )}
              <span>
                {t('simulateOffline')}
                <span className="block text-xs text-[var(--muted)]">
                  {t('simulateOfflineDesc')}
                </span>
              </span>
            </span>
            <input
              type="checkbox"
              checked={simulateOffline}
              onChange={(e) => onToggleSimulate(e.target.checked)}
              className="w-5 h-5 accent-[var(--ink)]"
            />
          </label>

          <p className="text-xs text-[var(--muted)]">{t('translationsNote')}</p>
        </div>
      </div>
    </div>
  );
}
