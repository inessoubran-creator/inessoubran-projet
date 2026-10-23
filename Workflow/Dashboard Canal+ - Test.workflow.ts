const d_clencheur_mensuel = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.4,
  config: { name: 'Déclencheur mensuel', parameters: { rule: { interval: [{ field: 'months', triggerAtHour: 9 }] } }, position: [-16, 0] }
});

const meta_Ads_donn_es_test = node({
  type: 'n8n-nodes-base.noOp',
  version: 1,
  config: { name: 'Meta Ads - données test', position: [208, 0] }
});

const fusion_Ads = merge({
  version: 3.2,
  config: { name: 'Fusion Ads', position: [432, -96] }
});

const google_Ads_donn_es_test = node({
  type: 'n8n-nodes-base.noOp',
  version: 1,
  config: { name: 'Google Ads - données test', position: [208, -192] }
});

const cRM_donn_es_test = node({
  type: 'n8n-nodes-base.noOp',
  version: 1,
  config: { name: 'CRM - données test', position: [432, 176] }
});

const fusion_Ads_CRM = merge({
  version: 3.2,
  config: { name: 'Fusion Ads + CRM', parameters: { mode: 'combine', fieldsToMatchString: 'canal', options: {} }, position: [656, 0] }
});

const donn_es_par_canal = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: { name: 'Données par canal', parameters: { operation: 'appendOrUpdate', documentId: { __rl: true, value: '1-GgbKCuTAWBCjeUquNfSYosf5nvXYK_dInjMtymdmjs', mode: 'list', cachedResultName: '    Dashboard Canal+', cachedResultUrl: 'https://docs.google.com/spreadsheets/d/1-GgbKCuTAWBCjeUquNfSYosf5nvXYK_dInjMtymdmjs/edit?usp=drivesdk' }, sheetName: { __rl: true, value: 'gid=0', mode: 'list', cachedResultName: 'Feuille 1', cachedResultUrl: 'https://docs.google.com/spreadsheets/d/1-GgbKCuTAWBCjeUquNfSYosf5nvXYK_dInjMtymdmjs/edit#gid=0' }, columns: { mappingMode: 'defineBelow', value: { canal: expr('{{ $json.canal }}'), mois: expr('{{ $json.mois }}'), budget: expr('{{ $json.budget }}'), impressions: expr('{{ $json.impressions }}'), clics: expr('{{ $json.clics }}'), visites: expr('{{ $json.visites }}'), leads: expr('{{ $json.leads }}'), ventes: expr('{{ $json.ventes }}') }, matchingColumns: ['canal'], schema: [{ id: 'mois', displayName: 'mois', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }, { id: 'canal', displayName: 'canal', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true, removed: false }, { id: 'budget', displayName: 'budget', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }, { id: 'impressions', displayName: 'impressions', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }, { id: 'clics', displayName: 'clics', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }, { id: 'visites', displayName: 'visites', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }, { id: 'leads', displayName: 'leads', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }, { id: 'ventes', displayName: 'ventes', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }], attemptToConvertTypes: false, convertFieldsToString: false }, options: {} }, credentials: { googleSheetsOAuth2Api: newCredential('Google Sheets - Stockage des données', 'AmkTXfW83yR5QevU') }, position: [880, 0] }
});

const calcul_KPI_globaux = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: { name: 'Calcul KPI globaux', parameters: { jsCode: 'const data = $input.all().map(item => item.json);\n\nconst totalBudget = data.reduce((sum, x) => sum + Number(x.budget || 0), 0);\nconst totalImpressions = data.reduce((sum, x) => sum + Number(x.impressions || 0), 0);\nconst totalClics = data.reduce((sum, x) => sum + Number(x.clics || 0), 0);\nconst totalVisites = data.reduce((sum, x) => sum + Number(x.visites || 0), 0);\nconst totalLeads = data.reduce((sum, x) => sum + Number(x.leads || 0), 0);\nconst totalVentes = data.reduce((sum, x) => sum + Number(x.ventes || 0), 0);\n\nconst googleAds = data.find(x => x.canal === \'Google Ads\');\nconst metaAds = data.find(x => x.canal === \'Meta Ads\');\n\nreturn [{\n  json: {\n    mois: data[0]?.mois,\n\n    budget_total: totalBudget,\n    impressions_total: totalImpressions,\n    clics_total: totalClics,\n    visites_total: totalVisites,\n    leads_total: totalLeads,\n    ventes_total: totalVentes,\n\n    budget_google: Number(googleAds?.budget || 0),\n    budget_meta: Number(metaAds?.budget || 0),\n\n    cout_par_lead: totalLeads\n      ? Number((totalBudget / totalLeads).toFixed(2))\n      : 0,\n\n    taux_conversion: totalVisites\n      ? Number(((totalLeads / totalVisites) * 100).toFixed(2))\n      : 0,\n\n    taux_clic: totalImpressions\n      ? Number(((totalClics / totalImpressions) * 100).toFixed(2))\n      : 0\n  }\n}];' }, position: [1104, 0] }
});

const g_n_ration_recommandations_IA = node({
  type: '@n8n/n8n-nodes-langchain.googleGemini',
  version: 1.2,
  config: { name: 'Génération recommandations IA', parameters: { modelId: { __rl: true, value: 'models/gemini-flash-lite-latest', mode: 'list', cachedResultName: 'Gemini Flash-Lite Latest' }, messages: { values: [{ content: expr('<role>\nTu es un analyste marketing expert en performance digitale et en analyse de campagnes publicitaires.\n</role>\n\n<instructions>\n\n<goal>\nÀ partir des KPI marketing reçus, génère une synthèse courte de la performance mensuelle ainsi que 3 recommandations concrètes et directement exploitables.\n</goal>\n\n<context>\nLes données proviennent de plusieurs canaux marketing, notamment Google Ads et Meta Ads.\n\nLes KPI disponibles peuvent inclure :\n- budget total\n- impressions\n- clics\n- visites\n- leads\n- ventes\n- coût par lead\n- taux de conversion\n- taux de clic\n\nL\'analyse doit rester concise, professionnelle et orientée décision.\n</context>\n\n<examples>\n\n<example_1>\n<inputs>\n{\n  "budget_total": 20500,\n  "leads_total": 2020,\n  "ventes_total": 325,\n  "cout_par_lead": 10.15,\n  "taux_conversion": 4.02\n}\n</inputs>\n\n<output>\nSYNTHÈSE\nBudget total : 20 500 €\nLeads générés : 2 020\nVentes : 325\nCoût par lead : 10,15 €\nTaux de conversion : 4,02 %\n\nRECOMMANDATIONS\n- Optimiser le tunnel de conversion afin d\'augmenter le taux de transformation des leads en clients.\n- Identifier les campagnes générant les leads au meilleur coût afin d\'améliorer l\'efficacité budgétaire.\n- Tester de nouvelles créations publicitaires afin d\'améliorer les performances de conversion.\n</output>\n</example_1>\n\n<example_2>\n<inputs>\n{\n  "budget_total": 15000,\n  "leads_total": 1200,\n  "ventes_total": 180,\n  "cout_par_lead": 12.5,\n  "taux_conversion": 3.5\n}\n</inputs>\n\n<output>\nSYNTHÈSE\nBudget total : 15 000 €\nLeads générés : 1 200\nVentes : 180\nCoût par lead : 12,50 €\nTaux de conversion : 3,50 %\n\nRECOMMANDATIONS\n- Réduire le coût par lead en optimisant les campagnes les moins performantes.\n- Améliorer le parcours entre la génération du lead et la conversion en vente.\n- Réallouer progressivement le budget vers les campagnes ayant le meilleur rendement.\n</output>\n</example_2>\n\n<example_3>\n<inputs>\n{\n  "budget_total": 25000,\n  "leads_total": 3000,\n  "ventes_total": 500,\n  "cout_par_lead": 8.33,\n  "taux_conversion": 5\n}\n</inputs>\n\n<output>\nSYNTHÈSE\nBudget total : 25 000 €\nLeads générés : 3 000\nVentes : 500\nCoût par lead : 8,33 €\nTaux de conversion : 5,00 %\n\nRECOMMANDATIONS\n- Augmenter les investissements sur les campagnes présentant le meilleur coût par lead.\n- Continuer les optimisations du tunnel afin de maintenir le taux de conversion.\n- Développer les campagnes les plus performantes avec des tests de nouvelles audiences.\n</output>\n</example_3>\n\n</examples>\n\n<output_format>\nRetourne exactement le format suivant :\n\nSYNTHÈSE\nBudget total : [budget]\nLeads générés : [leads]\nVentes : [ventes]\nCoût par lead : [CPL]\nTaux de conversion : [conversion]\n\nRECOMMANDATIONS\n- [recommandation 1]\n- [recommandation 2]\n- [recommandation 3]\n\nNe donne aucune explication supplémentaire.\n</output_format>\n\n</instructions>\n\n<inputs>\n\n<kpi_data>\n{{ JSON.stringify($json) }}\n</kpi_data>\n\n</inputs>') }] }, builtInTools: {}, options: {} }, credentials: { googlePalmApi: newCredential('Gemini API - Recommandations IA', 'Xvqcvyj2NkyAXPsC') }, position: [1328, 96] }
});

const mise_jour_Google_Slides = node({
  type: 'n8n-nodes-base.googleSlides',
  version: 2,
  config: { name: 'Mise à jour Google Slides', parameters: { operation: 'replaceText', presentationId: expr('1qaj-vl7S4RaVKW8t6_hL8-a03Js1BvxLJ5YR2woCyx4'), textUi: { textValues: [{ pageObjectIds: ['h7e3939c3f90f0cda_0_7'], text: 'MOIS', replaceText: expr('{{ String($json.mois) }}') }, { text: 'BUDGET_GA', replaceText: expr('{{ String($(\'Calcul KPI globaux\').item.json.budget_google) }}') }, { text: 'BUDGET_META', replaceText: expr('{{ String($(\'Calcul KPI globaux\').item.json.budget_meta) }}') }, { matchCase: true, text: 'IMPRESSIONS', replaceText: expr('{{ String($(\'Calcul KPI globaux\').item.json.impressions_total) }}') }, { matchCase: true, text: 'CLICS', replaceText: expr('{{ String($(\'Calcul KPI globaux\').item.json.clics_total) }}') }, { matchCase: true, text: 'VISITES', replaceText: expr('{{ String($(\'Calcul KPI globaux\').item.json.visites_total) }}') }, { matchCase: true, text: 'LEADS', replaceText: expr('{{ String($(\'Calcul KPI globaux\').item.json.leads_total) }}') }, { matchCase: true, text: 'VENTES', replaceText: expr('{{ String($(\'Calcul KPI globaux\').item.json.ventes_total) }}') }, { matchCase: true, text: 'CPL', replaceText: expr('{{ String($(\'Calcul KPI globaux\').item.json.cout_par_lead) + \' €\' }}') }, { matchCase: true, text: 'CONVERSION', replaceText: expr('{{ String($(\'Calcul KPI globaux\').item.json.taux_conversion) + \' %\' }}') }, { matchCase: true, text: 'CTR', replaceText: expr('{{ String($(\'Calcul KPI globaux\').item.json.taux_clic) + \' %\' }}') }, { matchCase: true, text: 'BUDGET_TOTAL', replaceText: expr('{{ String($(\'Calcul KPI globaux\').item.json.budget_total) + \' €\' }}') }, { text: 'SYNTHESE_IA', replaceText: expr('{{ $json.content.parts[0].text }}') }] }, options: {} }, credentials: { googleSlidesOAuth2Api: newCredential('Google Slides - Génération du reporting', 'INgrmt1olAZWZcf6') }, position: [1680, 96] }
});

const kPI_globaux = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: { name: 'KPI globaux', parameters: { operation: 'appendOrUpdate', documentId: { __rl: true, value: '1-GgbKCuTAWBCjeUquNfSYosf5nvXYK_dInjMtymdmjs', mode: 'list', cachedResultName: '    Dashboard Canal+', cachedResultUrl: 'https://docs.google.com/spreadsheets/d/1-GgbKCuTAWBCjeUquNfSYosf5nvXYK_dInjMtymdmjs/edit?usp=drivesdk' }, sheetName: { __rl: true, value: 1816680376, mode: 'list', cachedResultName: 'Feuille 2', cachedResultUrl: 'https://docs.google.com/spreadsheets/d/1-GgbKCuTAWBCjeUquNfSYosf5nvXYK_dInjMtymdmjs/edit#gid=1816680376' }, columns: { mappingMode: 'defineBelow', value: { mois: expr('{{ $json.mois }}'), budget_total: expr('{{ $json.budget_total }}'), impressions_total: expr('{{ $json.impressions_total }}'), clics_total: expr('{{ $json.clics_total }}'), visites_total: expr('{{ $json.visites_total }}'), leads_total: expr('{{ $json.leads_total }}'), ventes_total: expr('{{ $json.ventes_total }}'), cout_par_lead: expr('{{ $json.cout_par_lead }}'), taux_conversion: expr('{{ $json.taux_conversion }}'), taux_clic: expr('{{ $json.taux_clic }}') }, matchingColumns: ['mois'], schema: [{ id: 'mois', displayName: 'mois', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true, removed: false }, { id: 'budget_total', displayName: 'budget_total', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }, { id: 'impressions_total', displayName: 'impressions_total', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }, { id: 'clics_total', displayName: 'clics_total', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }, { id: 'visites_total', displayName: 'visites_total', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }, { id: 'leads_total', displayName: 'leads_total', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }, { id: 'ventes_total', displayName: 'ventes_total', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }, { id: 'cout_par_lead', displayName: 'cout_par_lead', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }, { id: 'taux_conversion', displayName: 'taux_conversion', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }, { id: 'taux_clic', displayName: 'taux_clic', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }], attemptToConvertTypes: false, convertFieldsToString: false }, options: {} }, credentials: { googleSheetsOAuth2Api: newCredential('Google Sheets - Stockage des données', 'AmkTXfW83yR5QevU') }, position: [1392, -96] }
});

const lecture_Google_Slides = node({
  type: 'n8n-nodes-base.googleSlides',
  version: 2,
  config: { name: 'Lecture Google Slides', parameters: { operation: 'getSlides', presentationId: '1qaj-vl7S4RaVKW8t6_hL8-a03Js1BvxLJ5YR2woCyx4' }, credentials: { googleSlidesOAuth2Api: newCredential('Google Slides - Génération du reporting', 'INgrmt1olAZWZcf6') }, position: [1680, -96] }
});

const wf = workflow('', 'Dashboard Canal+ - Test', { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: true });

export default wf
  .add(d_clencheur_mensuel
  .to([
    meta_Ads_donn_es_test,
    google_Ads_donn_es_test,
    cRM_donn_es_test]))
  .add(sticky('ÉTAPE 1 — COLLECTE DES DONNÉES\n\nObjectif :\nRécupérer les données nécessaires au suivi\ndes performances marketing.\n\nSources :\n• Google Ads\n• Meta Ads\n• CRM\n\nDonnées récupérées :\n• Budget\n• Impressions\n• Clics\n• Visites\n• Leads\n• Ventes\n• Mois\n• Canal\n\nDéclenchement :\n• Manuel pour les tests\n• Automatique : 1er jour du mois à 09:00\n\nSortie :\nDonnées brutes par canal prêtes à être\nfusionnées et analysées.', [], { name: 'Sticky Note', color: '#96D35F', width: 368, height: 480, position: [96, -704] }))
  .add(sticky('ÉTAPE 2 — CONSOLIDATION & CALCUL DES KPI\n\nObjectif :\nCentraliser les données des différentes sources\net calculer les indicateurs de performance.\n\nTraitement :\n• Fusion des données Google Ads et Meta Ads\n• Rapprochement avec les données CRM\n• Consolidation par canal\n• Calcul des KPI globaux\n\nKPI calculés :\n• Budget total\n• Impressions totales\n• Clics totaux\n• Visites totales\n• Leads totaux\n• Ventes totales\n• Coût par lead (CPL)\n• Taux de conversion\n• Taux de clic (CTR)\n\nSortie :\nUn jeu de données consolidé contenant\nles KPI marketing du mois.', [], { name: 'Sticky Note1', color: '#E63B7A', width: 352, height: 448, position: [688, -704] }))
  .add(sticky('ÉTAPE 3 — STOCKAGE & DASHBOARD\n\nObjectif :\nStocker les données consolidées et rendre\nles résultats facilement consultables.\n\nGoogle Sheets :\n• Feuille 1 → Données par canal\n• Feuille 2 → KPI globaux\n• Dashboard → Visualisation des résultats\n\nDonnées par canal :\nGoogle Ads + Meta Ads\n\nKPI globaux :\nBudget, impressions, clics, visites,\nleads, ventes, CPL, conversion et CTR.\n\nMode de mise à jour :\nAppend or Update Row\n\nClé de correspondance :\n• Canal pour les données par canal\n• Mois pour les KPI globaux\n\nRésultat :\nUne base de données marketing actualisée\nautomatiquement.', [], { name: 'Sticky Note2', color: '#BE38F3', width: 384, height: 448, position: [1312, -704] }))
  .add(sticky('ÉTAPE 4 — IA & GÉNÉRATION DU REPORTING\n\nObjectif :\nTransformer les KPI en une synthèse marketing\net en recommandations exploitables.\n\nIA :\nGemini API\n\nMéthode :\nAppel HTTP REST vers l\'API Gemini\n\nEntrée :\nKPI globaux du mois\n\nTraitement IA :\n• Analyse des performances\n• Génération d\'une synthèse\n• Génération de 3 recommandations\n\nSortie :\n• Synthèse marketing\n• Budget total\n• Leads générés\n• Ventes\n• CPL\n• Taux de conversion\n• 3 recommandations\n\nRestitution :\nMise à jour automatique de Google Slides.\n\nRésultat final :\nUn reporting marketing mensuel\nautomatisé et présentable.', [], { name: 'Sticky Note3', color: '#3A88FE', width: 400, height: 576, position: [1904, -704] }))
  .add(google_Ads_donn_es_test.to(fusion_Ads.input(0)))
  .add(meta_Ads_donn_es_test.to(fusion_Ads.input(1)))
  .add(cRM_donn_es_test.to(fusion_Ads_CRM.input(1)))
  .add(fusion_Ads.to(fusion_Ads_CRM.input(0)))
  .add(fusion_Ads_CRM)
  .to(donn_es_par_canal
  .to(calcul_KPI_globaux
  .to([
    g_n_ration_recommandations_IA
    .to(mise_jour_Google_Slides),
    kPI_globaux
    .to(lecture_Google_Slides)])))