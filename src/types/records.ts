export type FormType = 'RQSM' | 'VAA';
export type SyncStatus = 'pending' | 'synced';

export type QualityRating = 'not_evaluated' | 'insufficient' | 'sufficient_caveats' | 'sufficient' | 'excellent';
export type SatisfactionRating = 'not_evaluated' | 'totally_unsatisfied' | 'unsatisfied' | 'satisfied' | 'very_satisfied';
export type ImpactRating = 'not_evaluated' | 'low_impact' | 'relevant_impact' | 'transformative_impact';

export const QUALITY_OPTIONS = [
  { value: 'not_evaluated', label: 'Não avaliado' },
  { value: 'insufficient', label: 'Insuficiente' },
  { value: 'sufficient_caveats', label: 'Suficiente com ressalvas' },
  { value: 'sufficient', label: 'Suficiente' },
  { value: 'excellent', label: 'Excelente' },
] as const;

export const SATISFACTION_OPTIONS = [
  { value: 'not_evaluated', label: 'Não avaliado' },
  { value: 'totally_unsatisfied', label: 'Totalmente insatisfeitos' },
  { value: 'unsatisfied', label: 'Insatisfeitos' },
  { value: 'satisfied', label: 'Satisfeitos' },
  { value: 'very_satisfied', label: 'Muito satisfeitos' },
] as const;

export const IMPACT_OPTIONS = [
  { value: 'not_evaluated', label: 'Não avaliado' },
  { value: 'low_impact', label: 'Pouco impacto' },
  { value: 'relevant_impact', label: 'Impacto relevante' },
  { value: 'transformative_impact', label: 'Impacto transformador' },
] as const;

export const PSI_STAGES = [
  'Etapa 1 - Elaboração do PAP (primeiros 4 meses de projeto)',
  'Etapa 2 - Acompanhamento presencial do PAP (primeiros 20 meses de acompanhamento)',
  'Etapa 3 - Acompanhamento online do PAP',
] as const;

export const ACTIVITIES_OPTIONS = [
  'Plano de Trabalho',
  'Mapeamento de perfil da comunidade',
  'Elaboração do PAP',
  'Acompanhamento presencial do PAP',
  'Acompanhamento do PAP online',
  'Intercâmbios entre comunidades',
  'Capacitações diversas',
  'Eventos diversos',
] as const;

export const SUPERVISION_TYPES = [
  'Uma entrevista individual com uma família, ou seja [registrar cada entrevista em um relatório]',
  'Uma conversa coletiva e/ou observação de uma Comunidade, envolvendo diversas famílias',
  'Uma conversa coletiva com uma Associação, envolvendo diversas famílias e/ou comunidades',
  'Uma outra atividade de supervisão',
] as const;

export const OBSERVATION_OPTIONS = [
  'Sim, como principal atividade da visita, ocupando maior carga horária do que as entrevistas e outras',
  'Sim, mas como uma atividade secundária',
  'Não foi realizada observação das áreas produtivas',
] as const;

export const PARTICIPATION_OPTIONS = [
  'Sim, durante toda a atividade',
  'Sim, em parte da atividade',
  'Não houve participação de ninguém da ATS',
] as const;

export const SPECIFIC_SITUATIONS = [
  'Percepção, pela Supervisão e pelas famílias / Associação, de baixo conhecimento da ATS quanto a temas e/ou tecnologias sociais relevantes',
  'Baixa frequência da ATS no território, quanto a visitas técnicas, dias de campo, formações e reuniões',
  'Baixa participação dos beneficiários nas atividades de diagnóstico e na elaboração do PAP',
] as const;

export const CONCLUSION_OPTIONS = [
  'Excelente, condução e resultados exemplares',
  'Suficiente e sem necessidade de melhorias no momento',
  'Suficiente, mas COM necessidade de melhorias',
  'Insuficiente, COM necessidade urgente de melhorias',
] as const;

export interface BaseRecord {
  id: string;
  formType: FormType;
  createdAt: string;
  updatedAt?: string;
  syncStatus: SyncStatus;
  supervisorName: string;
}

export interface RQSMData {
  // Section 1
  municipality: string;
  atsName: string;
  lotName: string;
  dataSources: string;
  completionDate: string;
  psiStage: string;
  activities: string[];
  // Section 2 - Planning Quality
  planningClearLogical: QualityRating;
  planningRealistic: QualityRating;
  planningCompliance: QualityRating;
  // Section 3 - Work Execution
  executionWorkPlan: QualityRating;
  executionCommunityProfile: QualityRating;
  executionPAP: QualityRating;
  executionPAPSupport: QualityRating;
  executionProcurement: QualityRating;
  // Section 4 - Infrastructure
  infraTechniciansAdequacy: QualityRating;
  infraLogistics: QualityRating;
  infraWorkConditions: QualityRating;
  infraResourceApplication: QualityRating;
  infraAuditMechanisms: QualityRating;
  // Section 5 - Specific Situations
  specificSituations: string[];
  specificSituationsOther: string;
  // Section 6 - Beneficiary Satisfaction
  satisfactionAttention: SatisfactionRating;
  satisfactionImprovements: SatisfactionRating;
  satisfactionFrequency: SatisfactionRating;
  satisfactionTopics: SatisfactionRating;
  satisfactionCommunication: SatisfactionRating;
  // Section 7 - Technical Quality
  techQualityMethodologies: QualityRating;
  techQualityDocumentation: QualityRating;
  techQualityParticipation: QualityRating;
  techQualityTeamQualification: QualityRating;
  techQualityEnvironmental: QualityRating;
  techQualityWomenInclusion: QualityRating;
  techQualityYouthInclusion: QualityRating;
  // Section 8 - Technician Evaluation
  techEvalPunctuality: QualityRating;
  techEvalResponsibility: QualityRating;
  techEvalInterpersonal: QualityRating;
  techEvalTechnicalDomain: QualityRating;
  techEvalProactivity: QualityRating;
  // Section 9 - Impact Assessment
  impactProductivity: ImpactRating;
  impactProductQuality: ImpactRating;
  impactManagement: ImpactRating;
  impactParticipation: ImpactRating;
  impactEnvironmental: ImpactRating;
  impactWomen: ImpactRating;
  impactYouth: ImpactRating;
  // Section 10 - Mapping Quality
  mappingFamilyProfile: QualityRating;
  mappingEnvironmental: QualityRating;
  mappingResources: QualityRating;
  mappingStrategies: QualityRating;
  mappingTechnologies: QualityRating;
  // Section 11 - PAP Quality
  papCoherence: QualityRating;
  papActivities: QualityRating;
  papSafeguards: QualityRating;
  papProcurement: QualityRating;
  papAcquisitions: QualityRating;
  papBudget: QualityRating;
  papMarketValues: QualityRating;
  // Section 12 - PAP Implementation
  papImplExecution: QualityRating;
  papImplChanges: QualityRating;
  papImplAssociationParticipation: QualityRating;
  papImplSafeguards: QualityRating;
  papImplPublicPolicies: QualityRating;
  papImplMarketAccess: QualityRating;
  papImplRelevanceATS: QualityRating;
  papImplRelevanceResults: QualityRating;
  papImplObjectives: QualityRating;
  papImplATSAvailability: QualityRating;
  papImplBudgetTracking: QualityRating;
  papImplLearningChanges: QualityRating;
  // Section 13 - Conclusions
  introContext: string;
  generalConclusion: string;
  generalConclusionText: string;
  recommendations: string;
  fiscalizationNotes: string;
}

export interface VAAData {
  // Section 1
  municipality: string;
  supervisionType: string;
  associationName: string;
  communityName: string;
  familyNames: string;
  observationAreas: string;
  visitDate: string;
  psiStage: string;
  atsName: string;
  activitiesSupervised: string[];
  atsParticipation: string;
  atsParticipantNames: string;
  // Sections 2-12 same as RQSM
  planningClearLogical: QualityRating;
  planningRealistic: QualityRating;
  planningCompliance: QualityRating;
  executionWorkPlan: QualityRating;
  executionCommunityProfile: QualityRating;
  executionPAP: QualityRating;
  executionPAPSupport: QualityRating;
  executionProcurement: QualityRating;
  infraTechniciansAdequacy: QualityRating;
  infraLogistics: QualityRating;
  infraWorkConditions: QualityRating;
  infraResourceApplication: QualityRating;
  infraAuditMechanisms: QualityRating;
  specificSituations: string[];
  specificSituationsOther: string;
  satisfactionAttention: SatisfactionRating;
  satisfactionImprovements: SatisfactionRating;
  satisfactionFrequency: SatisfactionRating;
  satisfactionTopics: SatisfactionRating;
  satisfactionCommunication: SatisfactionRating;
  techQualityMethodologies: QualityRating;
  techQualityDocumentation: QualityRating;
  techQualityParticipation: QualityRating;
  techQualityTeamQualification: QualityRating;
  techQualityEnvironmental: QualityRating;
  techQualityWomenInclusion: QualityRating;
  techQualityYouthInclusion: QualityRating;
  techEvalPunctuality: QualityRating;
  techEvalResponsibility: QualityRating;
  techEvalInterpersonal: QualityRating;
  techEvalTechnicalDomain: QualityRating;
  techEvalProactivity: QualityRating;
  impactProductivity: ImpactRating;
  impactProductQuality: ImpactRating;
  impactManagement: ImpactRating;
  impactParticipation: ImpactRating;
  impactEnvironmental: ImpactRating;
  impactWomen: ImpactRating;
  impactYouth: ImpactRating;
  mappingFamilyProfile: QualityRating;
  mappingEnvironmental: QualityRating;
  mappingResources: QualityRating;
  mappingStrategies: QualityRating;
  mappingTechnologies: QualityRating;
  papCoherence: QualityRating;
  papActivities: QualityRating;
  papSafeguards: QualityRating;
  papProcurement: QualityRating;
  papAcquisitions: QualityRating;
  papBudget: QualityRating;
  papMarketValues: QualityRating;
  papImplExecution: QualityRating;
  papImplChanges: QualityRating;
  papImplAssociationParticipation: QualityRating;
  papImplSafeguards: QualityRating;
  papImplPublicPolicies: QualityRating;
  papImplMarketAccess: QualityRating;
  papImplRelevanceATS: QualityRating;
  papImplRelevanceResults: QualityRating;
  papImplObjectives: QualityRating;
  papImplATSAvailability: QualityRating;
  papImplBudgetTracking: QualityRating;
  papImplLearningChanges: QualityRating;
  // Section 13 - Conclusions (no fiscalizationNotes in VAA)
  introContext: string;
  generalConclusion: string;
  generalConclusionText: string;
  recommendations: string;
}

export interface RQSMRecord extends BaseRecord {
  formType: 'RQSM';
  data: RQSMData;
}

export interface VAARecord extends BaseRecord {
  formType: 'VAA';
  data: VAAData;
}

export type SupervisionRecord = RQSMRecord | VAARecord;
