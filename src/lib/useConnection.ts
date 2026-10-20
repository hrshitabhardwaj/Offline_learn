import { useEffect, useState } from 'react';

export type ConnStatus = 'online' | 'offline' | 'syncing';

type Options = {
  simulateOffline: boolean;
  onOnline?: () => void;
};

export function useConnection({ simulateOffline, onOnline }: Options) {
  const [status, setStatus] = useState<ConnStatus>('online');

  useEffect(() => {
    if (simulateOffline) {
      setStatus('offline');
      return;
    }
    const update = () => {
      setStatus(navigator.onLine ? 'online' : 'offline');
      if (navigator.onLine) onOnline?.();
    };
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, [simulateOffline, onOnline]);

  return {
    status,
    setStatus,
    isOnline: status === 'online' && !simulateOffline,
  };
}
