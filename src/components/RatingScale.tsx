import { cn } from '@/lib/utils';

interface RatingScaleProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  label: string;
  required?: boolean;
  hasError?: boolean;
}

export function RatingScale({ value, onChange, options, label, required, hasError }: RatingScaleProps) {
  return (
    <div className={cn("space-y-2 py-3 px-3 rounded-lg transition-colors", hasError && "bg-destructive/5 border border-destructive/20")}>
      <p className="text-sm font-medium leading-snug">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option, idx) => {
          const isSelected = value === option.value;
          const total = options.length;

          let bgClass = '';
          if (idx === 0) {
            bgClass = isSelected
              ? 'bg-rating-neutral text-primary-foreground shadow-sm'
              : 'border border-rating-neutral/50 text-muted-foreground hover:bg-muted';
          } else {
            const adjusted = total - 1;
            const pos = idx - 1;
            const ratio = pos / (adjusted - 1);
            let color = '';
            if (ratio <= 0) color = 'bg-rating-low';
            else if (ratio <= 0.4) color = 'bg-rating-mid';
            else if (ratio <= 0.7) color = 'bg-rating-high';
            else color = 'bg-rating-excellent';

            if (isSelected) {
              bgClass = `${color} text-primary-foreground shadow-sm`;
            } else {
              bgClass = 'border border-border text-foreground hover:bg-muted';
            }
          }

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                'rounded-lg px-3 py-2 text-xs font-medium transition-all min-h-[42px] flex-1 min-w-[80px]',
                bgClass
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
