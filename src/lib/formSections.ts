export interface SectionDef {
  title: string;
  type: 'identification' | 'rating' | 'specific_situations' | 'conclusions';
  scaleType?: 'quality' | 'satisfaction' | 'impact';
  items?: { key: string; label: string }[];
}

// Sections 2-12 shared by both RQSM and VAA
export const SHARED_EVALUATION_SECTIONS: SectionDef[] = [
  {
    title: 'Qualidade do Planejamento',
    type: 'rating',
    scaleType: 'quality',
    items: [
      { key: 'planningClearLogical', label: 'Planejamento claro, lógico e tecnicamente consistente' },
      { key: 'planningRealistic', label: 'Planejamento realista quanto aos prazos e recursos' },
      { key: 'planningCompliance', label: 'Cumprimento das ações planejadas e pactuadas' },
    ],
  },
  {
    title: 'Execução do Trabalho',
    type: 'rating',
    scaleType: 'quality',
    items: [
      { key: 'executionWorkPlan', label: 'Elaboração e revisão do Plano de Trabalho da ATS' },
      { key: 'executionCommunityProfile', label: 'Perfil das comunidades, das famílias e das Associações' },
      { key: 'executionPAP', label: 'Planos de Adaptação Produtiva (PAP)' },
      { key: 'executionPAPSupport', label: 'Assessoramento da implantação do PAP' },
      { key: 'executionProcurement', label: 'Apoio às aquisições e prestação de contas' },
    ],
  },
  {
    title: 'Infraestrutura e Gestão da ATS',
    type: 'rating',
    scaleType: 'quality',
    items: [
      { key: 'infraTechniciansAdequacy', label: 'Adequação do número de técnicos ao número de famílias atendidas e ao número de PAP' },
      { key: 'infraLogistics', label: 'Efetividade da logística e do cronograma de trabalho no território' },
      { key: 'infraWorkConditions', label: 'Condições de trabalho (veículos, equipamentos de informática, materiais de apoio) suficientes e em bom estado de funcionamento' },
      { key: 'infraResourceApplication', label: 'Aplicação dos recursos (financeiros, materiais e humanos) de forma eficiente e transparente' },
      { key: 'infraAuditMechanisms', label: 'Mecanismos de controle e auditoria interna para garantir a correta execução dos serviços' },
    ],
  },
  {
    title: 'Situações Específicas Observadas',
    type: 'specific_situations',
  },
  {
    title: 'Satisfação Geral dos Beneficiários',
    type: 'rating',
    scaleType: 'satisfaction',
    items: [
      { key: 'satisfactionAttention', label: 'Atenção e suporte recebido das ATS pelas famílias' },
      { key: 'satisfactionImprovements', label: 'Melhorias concretas das atividades das famílias' },
      { key: 'satisfactionFrequency', label: 'Frequência e duração dos atendimentos' },
      { key: 'satisfactionTopics', label: 'Adequação dos temas abordados, junto às famílias' },
      { key: 'satisfactionCommunication', label: 'Eficácia dos canais de comunicação entre ATS e famílias / Associações' },
    ],
  },
  {
    title: 'Qualidade Técnica da ATS',
    type: 'rating',
    scaleType: 'quality',
    items: [
      { key: 'techQualityMethodologies', label: 'Metodologias de ATS adequadas às necessidades e realidades dos agricultores e dos grupos de interesse' },
      { key: 'techQualityDocumentation', label: 'Registro sistemático e documentado de todas as atividades realizadas e dos participantes' },
      { key: 'techQualityParticipation', label: 'Participação ativa das famílias e/ou Associações nas atividades de planejamento e avaliação (controle social)' },
      { key: 'techQualityTeamQualification', label: 'Qualificação e experiência da equipe técnica e sua adequação às demandas e metodologias' },
      { key: 'techQualityEnvironmental', label: 'Existência de estratégias de preservação, conservação ambiental e uso sustentável' },
      { key: 'techQualityWomenInclusion', label: 'Existência de estratégias para inclusão e participação efetiva de Mulheres nas atividades e nas comunidades' },
      { key: 'techQualityYouthInclusion', label: 'Existência de estratégias para inclusão e participação efetiva de Jovens nas atividades e nas comunidades' },
    ],
  },
  {
    title: 'Avaliação do Técnico Responsável da ATS',
    type: 'rating',
    scaleType: 'quality',
    items: [
      { key: 'techEvalPunctuality', label: 'Pontualidade' },
      { key: 'techEvalResponsibility', label: 'Responsabilidade' },
      { key: 'techEvalInterpersonal', label: 'Relacionamento interpessoal' },
      { key: 'techEvalTechnicalDomain', label: 'Domínio técnico' },
      { key: 'techEvalProactivity', label: 'Proatividade' },
    ],
  },
  {
    title: 'Avaliação do Impacto do Projeto',
    type: 'rating',
    scaleType: 'impact',
    items: [
      { key: 'impactProductivity', label: 'Contribuição para o aumento da produtividade' },
      { key: 'impactProductQuality', label: 'Contribuição para a melhoria da qualidade dos produtos' },
      { key: 'impactManagement', label: 'Contribuição para uma gestão mais eficiente das propriedades' },
      { key: 'impactParticipation', label: 'Contribuição para a maior participação das famílias em grupos, cooperativas ou associações' },
      { key: 'impactEnvironmental', label: 'Efetividade das estratégias de preservação, conservação ambiental e uso sustentável' },
      { key: 'impactWomen', label: 'Efetividade das estratégias para inclusão e participação efetiva de Mulheres nas atividades e nas comunidades' },
      { key: 'impactYouth', label: 'Efetividade das estratégias para inclusão e participação efetiva de Jovens nas atividades e nas comunidades' },
    ],
  },
  {
    title: 'Qualidade do Mapeamento das Propriedades e do Perfil das Famílias',
    type: 'rating',
    scaleType: 'quality',
    items: [
      { key: 'mappingFamilyProfile', label: 'Perfil social das famílias foi elaborado conforme a metodologia determinada' },
      { key: 'mappingEnvironmental', label: 'Descrição da realidade ambiental, econômica e organizacional da associação' },
      { key: 'mappingResources', label: 'Descrição da forma de utilização dos recursos naturais pelas famílias' },
      { key: 'mappingStrategies', label: 'Descrição das estratégias de convivência com o Semiárido presentes na comunidade' },
      { key: 'mappingTechnologies', label: 'Identificação das tecnologias sociais demandadas pelos beneficiários' },
    ],
  },
  {
    title: 'Qualidade Técnica e Adequação do PAP Elaborado',
    type: 'rating',
    scaleType: 'quality',
    items: [
      { key: 'papCoherence', label: 'Coerência do PAP com as demandas da comunidade, manifestas no Perfil da comunidade' },
      { key: 'papActivities', label: 'Itens descritos no PAP relacionados às atividades produtivas escolhidas' },
      { key: 'papSafeguards', label: 'PAP de acordo com as salvaguardas sociais e ambientais' },
      { key: 'papProcurement', label: 'Itens descritos no PAP de acordo com o regulamento de compras (SAF/BID/FIDA)' },
      { key: 'papAcquisitions', label: 'Descrição detalhada das aquisições a serem realizadas' },
      { key: 'papBudget', label: 'PAP adequado com o valor teto estipulado pelo PSI' },
      { key: 'papMarketValues', label: 'Valores descritos de acordo com valores de mercado' },
    ],
  },
  {
    title: 'Acompanhamento e Qualidade da Implementação do PAP',
    type: 'rating',
    scaleType: 'quality',
    items: [
      { key: 'papImplExecution', label: 'Execução do PAP conforme o planejamento de atividades e as previsões financeiras' },
      { key: 'papImplChanges', label: 'Mudanças no PAP realizadas em conformidade com a Associação e a gestão do PSI' },
      { key: 'papImplAssociationParticipation', label: 'Participação ativa da Associação nas atividades de execução do PAP' },
      { key: 'papImplSafeguards', label: 'Observância plena dos compromissos e salvaguardas sociais e ambientais' },
      { key: 'papImplPublicPolicies', label: 'Apoio e viabilização, da ATS, do acesso a Políticas Públicas pela Associação' },
      { key: 'papImplMarketAccess', label: 'Apoio e viabilização, da ATS, do acesso a mercados e clientes pela Associação' },
      { key: 'papImplRelevanceATS', label: 'Relevância do serviço de ATS/PSI para a mudança de algumas práticas e melhorias nas técnicas de produção, manejo e gestão' },
      { key: 'papImplRelevanceResults', label: 'Relevância da ATS para a melhoria dos resultados e geração de impactos, contribuindo efetivamente para a Associação' },
      { key: 'papImplObjectives', label: 'Alcance dos objetivos gerais do PAP estabelecidos no início do projeto' },
      { key: 'papImplATSAvailability', label: 'Disponibilidade e prioridade da ATS, e suporte efetivo, às Associações e famílias' },
      { key: 'papImplBudgetTracking', label: 'Acompanhamento do orçamento, do processo de aquisição e prestação de contas, e da conformidade da prestação de contas' },
      { key: 'papImplLearningChanges', label: 'Mudanças no PAP realizadas a partir de aprendizado e considerações técnicas' },
    ],
  },
];
