import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormProgressBar, FormWizardNav } from '@/components/FormWizardNav';
import { RatingSection, SpecificSituationsSection } from '@/components/FormSections';
import { SHARED_EVALUATION_SECTIONS } from '@/lib/formSections';
import { ConnectionBanner } from '@/components/ConnectionBanner';
import { saveRecord, getRecord } from '@/lib/db';
import { PSI_STAGES, ACTIVITIES_OPTIONS, CONCLUSION_OPTIONS } from '@/types/records';
import type { RQSMRecord, RQSMData } from '@/types/records';
import { ATS_OPTIONS, MUNICIPALITY_OPTIONS } from '@/lib/referenceData';
import { SearchableSelect } from '@/components/SearchableSelect';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const SECTION_LABELS = [
  'Identificação',
  ...SHARED_EVALUATION_SECTIONS.map((s) => s.title),
  'Conclusões e Observações',
];

function createEmptyRQSMData(): RQSMData {
  return {
    municipality: '', atsName: '', lotName: '', dataSources: '', completionDate: '', psiStage: '', activities: [],
    planningClearLogical: 'not_evaluated', planningRealistic: 'not_evaluated', planningCompliance: 'not_evaluated',
    executionWorkPlan: 'not_evaluated', executionCommunityProfile: 'not_evaluated', executionPAP: 'not_evaluated', executionPAPSupport: 'not_evaluated', executionProcurement: 'not_evaluated',
    infraTechniciansAdequacy: 'not_evaluated', infraLogistics: 'not_evaluated', infraWorkConditions: 'not_evaluated', infraResourceApplication: 'not_evaluated', infraAuditMechanisms: 'not_evaluated',
    specificSituations: [], specificSituationsOther: '',
    satisfactionAttention: 'not_evaluated', satisfactionImprovements: 'not_evaluated', satisfactionFrequency: 'not_evaluated', satisfactionTopics: 'not_evaluated', satisfactionCommunication: 'not_evaluated',
    techQualityMethodologies: 'not_evaluated', techQualityDocumentation: 'not_evaluated', techQualityParticipation: 'not_evaluated', techQualityTeamQualification: 'not_evaluated', techQualityEnvironmental: 'not_evaluated', techQualityWomenInclusion: 'not_evaluated', techQualityYouthInclusion: 'not_evaluated',
    techEvalPunctuality: 'not_evaluated', techEvalResponsibility: 'not_evaluated', techEvalInterpersonal: 'not_evaluated', techEvalTechnicalDomain: 'not_evaluated', techEvalProactivity: 'not_evaluated',
    impactProductivity: 'not_evaluated', impactProductQuality: 'not_evaluated', impactManagement: 'not_evaluated', impactParticipation: 'not_evaluated', impactEnvironmental: 'not_evaluated', impactWomen: 'not_evaluated', impactYouth: 'not_evaluated',
    mappingFamilyProfile: 'not_evaluated', mappingEnvironmental: 'not_evaluated', mappingResources: 'not_evaluated', mappingStrategies: 'not_evaluated', mappingTechnologies: 'not_evaluated',
    papCoherence: 'not_evaluated', papActivities: 'not_evaluated', papSafeguards: 'not_evaluated', papProcurement: 'not_evaluated', papAcquisitions: 'not_evaluated', papBudget: 'not_evaluated', papMarketValues: 'not_evaluated',
    papImplExecution: 'not_evaluated', papImplChanges: 'not_evaluated', papImplAssociationParticipation: 'not_evaluated', papImplSafeguards: 'not_evaluated', papImplPublicPolicies: 'not_evaluated', papImplMarketAccess: 'not_evaluated', papImplRelevanceATS: 'not_evaluated', papImplRelevanceResults: 'not_evaluated', papImplObjectives: 'not_evaluated', papImplATSAvailability: 'not_evaluated', papImplBudgetTracking: 'not_evaluated', papImplLearningChanges: 'not_evaluated',
    introContext: '', generalConclusion: '', generalConclusionText: '', recommendations: '', fiscalizationNotes: '',
  };
}

function validateRQSM(supervisorName: string, data: RQSMData): string[] {
  const errors: string[] = [];
  if (!supervisorName.trim()) errors.push('Nome do Supervisor');
  if (!data.atsName) errors.push('ATS');
  if (!data.municipality) errors.push('Município');
  if (!data.completionDate) errors.push('Data de conclusão');
  if (!data.psiStage) errors.push('Etapa do PSI');

  // Check all rating fields
  const ratingFields = SHARED_EVALUATION_SECTIONS.flatMap(s => s.items?.map(i => i.key) || []);
  const unevaluated = ratingFields.filter(k => (data as any)[k] === 'not_evaluated');
  if (unevaluated.length > 0) errors.push(`${unevaluated.length} avaliação(ões) não preenchida(s)`);

  if (!data.generalConclusion) errors.push('Conclusão geral');
  return errors;
}

export default function RQSMForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [supervisorName, setSupervisorName] = useState('');
  const [data, setData] = useState<RQSMData>(createEmptyRQSMData());
  const [recordId] = useState(() => id || crypto.randomUUID());
  const [loaded, setLoaded] = useState(!id);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (id) {
      getRecord(id).then((rec) => {
        if (rec && rec.formType === 'RQSM') {
          setSupervisorName(rec.supervisorName);
          setData(rec.data as RQSMData);
        }
        setLoaded(true);
      });
    }
  }, [id]);

  const totalSteps = SECTION_LABELS.length;

  const updateData = useCallback((key: string, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const errorFields = useMemo(() => {
    if (!showErrors) return new Set<string>();
    const ratingFields = SHARED_EVALUATION_SECTIONS.flatMap(s => s.items?.map(i => i.key) || []);
    return new Set(ratingFields.filter(k => (data as any)[k] === 'not_evaluated'));
  }, [showErrors, data]);

  const handleSaveDraft = useCallback(async () => {
    const record: RQSMRecord = {
      id: recordId,
      formType: 'RQSM',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending',
      supervisorName,
      data,
    };
    await saveRecord(record);
    toast.success('Rascunho salvo!');
  }, [recordId, supervisorName, data]);

  const handleFinish = useCallback(async () => {
    const errors = validateRQSM(supervisorName, data);
    if (errors.length > 0) {
      setShowErrors(true);
      toast.error(`Campos obrigatórios não preenchidos: ${errors.join(', ')}`);
      return;
    }
    await handleSaveDraft();
    toast.success('RQSM salvo com sucesso!');
    navigate('/');
  }, [handleSaveDraft, navigate, supervisorName, data]);

  const goNext = () => { setDirection('right'); setStep((s) => Math.min(s + 1, totalSteps - 1)); };
  const goPrev = () => { setDirection('left'); setStep((s) => Math.max(s - 1, 0)); };

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  if (!loaded) return <div className="flex items-center justify-center min-h-screen"><p className="text-muted-foreground">Carregando...</p></div>;

  const toggleActivity = (activity: string) => {
    const current = data.activities;
    updateData('activities', current.includes(activity) ? current.filter((a) => a !== activity) : [...current, activity]);
  };

  const fieldError = (condition: boolean) => showErrors && condition ? 'border-destructive' : '';

  const renderStep = () => {
    if (step === 0) {
      return (
        <div className="space-y-5 p-4">
          <h3 className="text-base font-bold">Identificação</h3>
          <div className="space-y-4">
            <div>
              <Label>Nome do(a) Supervisor(a) <span className="text-destructive">*</span></Label>
              <Input value={supervisorName} onChange={(e) => setSupervisorName(e.target.value)} placeholder="Nome completo" className={cn("rounded-lg", fieldError(!supervisorName.trim()))} />
            </div>
            <div>
              <Label>ATS sendo avaliada <span className="text-destructive">*</span></Label>
              <SearchableSelect value={data.atsName} onValueChange={(v) => updateData('atsName', v)} options={ATS_OPTIONS} placeholder="Selecione a ATS" />
            </div>
            <div>
              <Label>Município <span className="text-destructive">*</span></Label>
              <SearchableSelect value={data.municipality || ''} onValueChange={(v) => updateData('municipality', v)} options={MUNICIPALITY_OPTIONS} placeholder="Selecione o município" />
            </div>
            <div>
              <Label>Lote correspondente à avaliação</Label>
              <Input value={data.lotName} onChange={(e) => updateData('lotName', e.target.value)} className="rounded-lg" />
            </div>
            <div>
              <Label>Fontes de dados utilizadas</Label>
              <Textarea value={data.dataSources} onChange={(e) => updateData('dataSources', e.target.value)} className="rounded-lg" />
            </div>
            <div>
              <Label>Data de conclusão do RQSM <span className="text-destructive">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal rounded-lg", !data.completionDate && "text-muted-foreground", fieldError(!data.completionDate))}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data.completionDate ? format(new Date(data.completionDate), "PPP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={data.completionDate ? new Date(data.completionDate) : undefined} onSelect={(d) => updateData('completionDate', d?.toISOString() || '')} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Etapa do PSI correspondente <span className="text-destructive">*</span></Label>
              <Select value={data.psiStage} onValueChange={(v) => updateData('psiStage', v)}>
                <SelectTrigger className={cn("rounded-lg", fieldError(!data.psiStage))}><SelectValue placeholder="Selecione a etapa" /></SelectTrigger>
                <SelectContent>{PSI_STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Atividades consideradas para avaliação</Label>
              <div className="space-y-2 mt-2">
                {ACTIVITIES_OPTIONS.map((a) => (
                  <label key={a} className="flex items-center gap-3 text-sm cursor-pointer p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Checkbox checked={data.activities.includes(a)} onCheckedChange={() => toggleActivity(a)} />
                    <span>{a}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (step === totalSteps - 1) {
      return (
        <div className="space-y-5 p-4">
          <h3 className="text-base font-bold">Conclusões e Observações Finais</h3>
          <div>
            <Label>Introdução e contextualização</Label>
            <Textarea value={data.introContext} onChange={(e) => updateData('introContext', e.target.value)} placeholder="Faça uma breve introdução e contextualização sobre a visita / atividades, incluindo as suas observações" className="min-h-[100px] rounded-lg" />
          </div>
          <div>
            <Label>Conclusão geral <span className="text-destructive">*</span></Label>
            <Select value={data.generalConclusion} onValueChange={(v) => updateData('generalConclusion', v)}>
              <SelectTrigger className={cn("rounded-lg", fieldError(!data.generalConclusion))}><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{CONCLUSION_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
            <Textarea value={data.generalConclusionText} onChange={(e) => updateData('generalConclusionText', e.target.value)} placeholder="Complemento da conclusão..." className="mt-2 min-h-[80px] rounded-lg" />
          </div>
          <div>
            <Label>Recomendações gerais</Label>
            <Textarea value={data.recommendations} onChange={(e) => updateData('recommendations', e.target.value)} placeholder="Quais as recomendações gerais e as melhorias sugeridas no trabalho das ATS, caso necessárias" className="min-h-[100px] rounded-lg" />
          </div>
          <div>
            <Label>Considerações para fiscalização</Label>
            <Textarea value={data.fiscalizationNotes} onChange={(e) => updateData('fiscalizationNotes', e.target.value)} placeholder="Faça as considerações que você entende que são importantes para a fiscalização do contrato" className="min-h-[100px] rounded-lg" />
          </div>
        </div>
      );
    }

    const sectionIdx = step - 1;
    const section = SHARED_EVALUATION_SECTIONS[sectionIdx];

    if (section.type === 'specific_situations') {
      return (
        <div className="p-4">
          <SpecificSituationsSection
            selectedSituations={data.specificSituations}
            otherText={data.specificSituationsOther}
            onSituationsChange={(v) => updateData('specificSituations', v)}
            onOtherTextChange={(v) => updateData('specificSituationsOther', v)}
          />
        </div>
      );
    }

    return (
      <div className="p-4">
        <RatingSection
          title={section.title}
          items={section.items || []}
          scaleType={section.scaleType || 'quality'}
          data={data as any}
          onChange={updateData}
          errors={errorFields}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ConnectionBanner />
      <FormProgressBar currentStep={step} totalSteps={totalSteps} sectionLabels={SECTION_LABELS} />
      <div className={`flex-1 overflow-y-auto pb-20 ${direction === 'right' ? 'slide-enter-right' : 'slide-enter-left'}`} key={step}>
        {renderStep()}
      </div>
      <FormWizardNav
        currentStep={step}
        totalSteps={totalSteps}
        onPrev={goPrev}
        onNext={goNext}
        onSaveDraft={handleSaveDraft}
        onFinish={handleFinish}
        sectionLabels={SECTION_LABELS}
      />
    </div>
  );
}
