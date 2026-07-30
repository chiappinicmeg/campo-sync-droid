import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, TreePine, RefreshCw, Trash2, Eye, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConnectionBanner } from '@/components/ConnectionBanner';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getAllRecords, getPendingRecords, markAsSynced, deleteRecord, getPendingCount } from '@/lib/db';
import type { SupervisionRecord } from '@/types/records';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import logoImg from '@/assets/logo.png';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function Home() {
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const [records, setRecords] = useState<SupervisionRecord[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const loadRecords = async () => {
    const all = await getAllRecords();
    setRecords(all);
    const count = await getPendingCount();
    setPendingCount(count);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const pending = await getPendingRecords();
      if (pending.length === 0) {
        toast.info('Nenhum registro pendente.');
        setSyncing(false);
        return;
      }

      const exportData = {
        exportedAt: new Date().toISOString(),
        records: pending.map((r) => ({
          id: r.id,
          formType: r.formType,
          createdAt: r.createdAt,
          syncStatus: r.syncStatus,
          data: { supervisorName: r.supervisorName, ...(r as any).data },
        })),
      };

      const response = await fetch('https://ats-eight-mu.vercel.app/api/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'ats-forms-key-2026',
        },
        body: JSON.stringify(exportData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro da API: ${response.status} - ${errorText}`);
      }

      await markAsSynced(pending.map((r) => r.id));
      toast.success(`${pending.length} registro(s) sincronizado(s) com sucesso!`);
      await loadRecords();
    } catch (err) {
      console.error('Sync error:', err);
      toast.error(err instanceof Error ? err.message : 'Erro ao sincronizar.');
    }
    setSyncing(false);
  };

  const handleDelete = async (id: string) => {
    await deleteRecord(id);
    toast.success('Registro excluído.');
    await loadRecords();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ConnectionBanner />

      {/* Header */}
      <header className="px-5 py-5 bg-primary text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Logo Supervisão PSI" className="h-10 w-10 rounded-full bg-white p-0.5" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">Supervisão PSI</h1>
              <p className="text-primary-foreground/70 text-xs mt-0.5">Sistema de coleta de dados</p>
            </div>
          </div>
          {isOnline && pendingCount > 0 && (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleSync}
              disabled={syncing}
              className="gap-2 rounded-full shadow-md"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              Sincronizar
            </Button>
          )}
        </div>
        {pendingCount > 0 && (
          <div className="mt-3 bg-primary-foreground/15 rounded-lg px-3 py-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
            <p className="text-xs font-medium text-primary-foreground/90">
              {pendingCount} registro(s) pendente(s) de sincronização
            </p>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/rqsm/new')}
            className="group flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/40 transition-all min-h-[130px]"
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <span className="text-sm font-bold block">Novo RQSM</span>
              <span className="text-[10px] text-muted-foreground">Relatório de Qualidade</span>
            </div>
          </button>
          <button
            onClick={() => navigate('/vaa/new')}
            className="group flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/40 transition-all min-h-[130px]"
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <TreePine className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <span className="text-sm font-bold block">Nova VAA</span>
              <span className="text-[10px] text-muted-foreground">Visita e Avaliação</span>
            </div>
          </button>
        </div>

        {/* Records List */}
        <div>
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Registros Salvos ({records.length})
          </h2>
          {records.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium">Nenhum registro ainda</p>
              <p className="text-xs mt-1">Crie um novo RQSM ou VAA para começar.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${record.formType === 'RQSM' ? 'bg-primary/10' : 'bg-info/10'}`}>
                    {record.formType === 'RQSM' ? (
                      <ClipboardList className="h-5 w-5 text-primary" />
                    ) : (
                      <TreePine className="h-5 w-5 text-info" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${record.formType === 'RQSM' ? 'bg-primary/10 text-primary' : 'bg-info/10 text-info'}`}>
                        {record.formType}
                      </span>
                      <span className="text-[10px] font-medium">
                        {record.syncStatus === 'pending' ? '🟡 Pendente' : '✅ Sincronizado'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold truncate">{record.supervisorName || 'Sem nome'}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {format(new Date(record.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary"
                      onClick={() => navigate(`/${record.formType.toLowerCase()}/${record.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-destructive/10 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir registro?</AlertDialogTitle>
                          <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(record.id)} className="rounded-full bg-destructive hover:bg-destructive/90">
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
