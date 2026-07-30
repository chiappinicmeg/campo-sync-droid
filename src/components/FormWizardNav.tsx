import { ChevronLeft, ChevronRight, Save, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface FormWizardNavProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onFinish: () => void;
  sectionLabels: string[];
}

export function FormProgressBar({ currentStep, totalSteps, sectionLabels }: { currentStep: number; totalSteps: number; sectionLabels: string[] }) {
  const navigate = useNavigate();
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3 space-y-2">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
          {currentStep + 1} / {totalSteps}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs font-semibold text-foreground truncate">{sectionLabels[currentStep]}</p>
    </div>
  );
}

export function FormWizardNav({ currentStep, totalSteps, onPrev, onNext, onSaveDraft, onFinish }: FormWizardNavProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className="sticky bottom-0 z-20 bg-card/95 backdrop-blur-sm border-t border-border px-4 py-3 flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrev}
        disabled={isFirst}
        className="gap-1.5 rounded-full px-4"
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onSaveDraft}
        className="gap-1.5 ml-auto text-muted-foreground hover:text-primary"
      >
        <Save className="h-4 w-4" />
        Rascunho
      </Button>

      {isLast ? (
        <Button size="sm" onClick={onFinish} className="gap-1.5 rounded-full px-5 bg-primary hover:bg-primary/90 shadow-md">
          <CheckCircle2 className="h-4 w-4" />
          Finalizar
        </Button>
      ) : (
        <Button size="sm" onClick={onNext} className="gap-1.5 rounded-full px-5 shadow-sm">
          Próximo
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
