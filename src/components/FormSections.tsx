import {
  QUALITY_OPTIONS,
  SATISFACTION_OPTIONS,
  IMPACT_OPTIONS,
  SPECIFIC_SITUATIONS,
} from '@/types/records';
import { RatingScale } from '@/components/RatingScale';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type ScaleType = 'quality' | 'satisfaction' | 'impact';

interface RatingItem {
  key: string;
  label: string;
}

interface RatingSectionProps {
  title: string;
  items: RatingItem[];
  scaleType: ScaleType;
  data: Record<string, string>;
  onChange: (key: string, value: string) => void;
  errors?: Set<string>;
}

const SCALE_MAP = {
  quality: QUALITY_OPTIONS,
  satisfaction: SATISFACTION_OPTIONS,
  impact: IMPACT_OPTIONS,
};

export function RatingSection({ title, items, scaleType, data, onChange, errors }: RatingSectionProps) {
  const options = SCALE_MAP[scaleType];

  return (
    <div className="space-y-1">
      <h3 className="text-base font-bold mb-4">{title}</h3>
      {items.map((item) => (
        <RatingScale
          key={item.key}
          label={item.label}
          value={data[item.key] || 'not_evaluated'}
          onChange={(val) => onChange(item.key, val)}
          options={options}
          required
          hasError={errors?.has(item.key)}
        />
      ))}
    </div>
  );
}

interface SpecificSituationsSectionProps {
  selectedSituations: string[];
  otherText: string;
  onSituationsChange: (situations: string[]) => void;
  onOtherTextChange: (text: string) => void;
}

export function SpecificSituationsSection({
  selectedSituations,
  otherText,
  onSituationsChange,
  onOtherTextChange,
}: SpecificSituationsSectionProps) {
  const toggleSituation = (situation: string) => {
    if (selectedSituations.includes(situation)) {
      onSituationsChange(selectedSituations.filter((s) => s !== situation));
    } else {
      onSituationsChange([...selectedSituations, situation]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold">Situações Específicas Observadas</h3>
      <div className="space-y-3">
        {SPECIFIC_SITUATIONS.map((situation) => (
          <label key={situation} className="flex items-start gap-3 text-sm cursor-pointer p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
            <Checkbox
              checked={selectedSituations.includes(situation)}
              onCheckedChange={() => toggleSituation(situation)}
              className="mt-0.5"
            />
            <span className="leading-snug">{situation}</span>
          </label>
        ))}
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Outras situações</Label>
        <Textarea
          value={otherText}
          onChange={(e) => onOtherTextChange(e.target.value)}
          placeholder="Descreva outras situações observadas..."
          className="min-h-[80px] rounded-lg"
        />
      </div>
    </div>
  );
}
