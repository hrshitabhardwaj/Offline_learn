import { CloudOff } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export function OfflineBanner({ show }: { show: boolean }) {
  const { t } = useI18n();
  if (!show) return null;
  return (
    <div className="bg-[var(--ink)] text-[var(--bg)] text-center text-sm py-2 px-4 flex items-center justify-center gap-2">
      <CloudOff className="w-4 h-4" strokeWidth={1.8} />
      {t('offlineBanner')}
    </div>
  );
}
