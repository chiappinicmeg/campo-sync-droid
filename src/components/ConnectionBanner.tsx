import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Wifi, WifiOff } from 'lucide-react';

export function ConnectionBanner() {
  const isOnline = useOnlineStatus();

  return (
    <div
      className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium ${
        isOnline
          ? 'bg-status-online text-primary-foreground'
          : 'bg-status-offline text-primary-foreground'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span>Sem conexão — dados salvos localmente</span>
        </>
      )}
    </div>
  );
}
