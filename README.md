# Dashboard Marketing Mensuel — Canal+

![Vue d'ensemble du workflow n8n](Video/workflow-canvas-canalplus.jpg)

**Reporting marketing mensuel automatisé** : collecte (Google Ads, Meta Ads, CRM) → KPI calculés → synthèse + 3 recommandations par IA (Gemini) → Google Sheets & Google Slides mis à jour automatiquement.

> ⚠️ Version de test : sources branchées sur des données fictives (`noOp`), les vrais connecteurs se branchent au même endroit.

## 🚀 Ce que fait le workflow

Le **1er de chaque mois à 9h** (ou au clic pour tester), il :

1. **Collecte** budget, impressions, clics, visites, leads, ventes par canal
2. **Fusionne** Google Ads + Meta Ads, rapproche le CRM **par canal**
3. **Calcule** les KPI : budget total, CPL, taux de conversion, CTR…
4. **Analyse** avec Gemini : synthèse + 3 recommandations exploitables
5. **Rend** : écriture Google Sheets (données par canal + KPI) + texte remplacé dans Google Slides

## 📂 Contenu du dépôt

- `Workflow/` — workflow-as-code n8n (`Dashboard Canal+ - Test.workflow.ts`)
- `Skills/` — 3 skills OpenCode utilisés sur le projet (ci-dessous)
- `Video/` — captures & exports de démo

## 🤖 Skills OpenCode

- **`interview`** — conduire un entretien technique (grille, banque de questions, notation, compte-rendu)
- **`doubt-driven-dev`** — transformer chaque doute en hypothèse testée avant de coder
- **`hostile-review`** — revue façon attaquant : preuves, risques classés, zéro compliment

## 🛠️ Prérequis

- Instance n8n + 3 crédentials : Google Sheets, Google Slides (OAuth2) + Gemini API
- Google Sheets « Dashboard Canal+ » : Feuille 1 = données/canal, Feuille 2 = KPI/mois
- Template Google Slides avec les placeholders (MOIS, BUDGET_GA, IMPRESSIONS… SYNTHESE_IA)

---

*Projet : Inès Soubran — dashboard Canal+ · n8n · OpenCode*
