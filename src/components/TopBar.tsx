import { useAuth } from '@/lib/auth';
import type { ConnStatus } from '@/lib/useConnection';
import { useI18n } from '@/lib/i18n';
import { LanguageSelector } from '@/components/LanguageSelector';
import { CloudOff, RefreshCw, Settings, Wifi } from 'lucide-react';

type Props = {
  status: ConnStatus;
  onSync: () => void;
  onOpenSettings: () => void;
};

export function TopBar({ status, onSync, onOpenSettings }: Props) {
  const { displayName, signOut } = useAuth();
  const { t } = useI18n();
  const initial = displayName.charAt(0).toUpperCase() || 'S';

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg)]/90 backdrop-blur border-b border-[var(--line)]">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="text-base font-semibold tracking-tight">{t('appName')}</span>
        <div className="flex items-center gap-2">
          <LanguageSelector compact />
          <StatusBadge status={status} />
          {status === 'online' && (
            <button onClick={onSync} className="btn-ghost btn-sm" aria-label={t('sync')}>
              <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.8} />
              {t('sync')}
            </button>
          )}
          <button onClick={onOpenSettings} className="btn-ghost btn-sm !px-2" aria-label={t('settings')}>
            <Settings className="w-4 h-4" strokeWidth={1.8} />
          </button>
          <button
            onClick={() => void signOut()}
            className="w-8 h-8 rounded-full border border-[var(--line)] flex items-center justify-center text-xs font-medium"
            aria-label={t('signOut')}
            title={t('signOut')}
          >
            {initial}
          </button>
        </div>
      </div>
    </header>
  );
}

export function StatusBadge({ status }: { status: ConnStatus }) {
  const { t } = useI18n();
  const map = {
    online: { label: t('online'), icon: Wifi },
    offline: { label: t('offline'), icon: CloudOff },
    syncing: { label: t('syncing'), icon: RefreshCw },
  } as const;
  const { label, icon: Icon } = map[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs border border-[var(--line)] bg-white rounded-full px-2.5 py-1">
      <Icon
        className={`w-3.5 h-3.5 ${status === 'syncing' ? 'animate-spin' : ''}`}
        strokeWidth={1.8}
      />
      {label}
    </span>
  );
}
