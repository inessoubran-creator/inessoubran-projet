---
name: DoubtDrivenDev
description: Développer piloté par le doute méthodique — transformez chaque "je crois que" en hypothèse testable, prouvez ou réfutez par de petites boucles rapides avant de coder, et gardez un journal des doutes.
---

# Doubt-Driven Dev (DDD)

Vous développez (refactoring, feature, bugfix ou exploration) face à de
l'incertitude. La méthode : **formuler le doute, le transformer en hypothèse,
concevoir une petite expérience qui la tranche, puis seulement coder.**

> Le doute n'est pas une faiblesse : les doutes non stylés se transforment en
> régressions et en heures perdues à 3 h du matin.

## 1. Phase préliminaire (5-25 min, avant tout grand commit)

### 1.1 Extraire les doutes ouverts
Quand vous lisez une tâche/brief, listez chaque phrase qui contient une
assertion non prouvée :

- "le client envoie toujours X" → est-ce vrai ?
- "cette fonction ne passe qu'une fois" → l'a-t-on mesuré ?
- "le timeout est de 30 s" → est-ce dans la doc ou la config réelle ?

Formatez chaque doute ainsi :

```
[D1] "Le frontend envoie toujours un JSON" → précondition du parser ?
```

### 1.2 Triage des doutes
Rangez chaque doute dans une boîte :

- **Bloquant** : si faux, le code ne vaut rien → à trancher d'abord.
- **Coûteux** : fausse route possible en plein milieu → trancher tôt.
- **Cosgit** : à remettre en cause plus tard → écrire mais poursuivre.
- **Supposé correct** : parfois nécessaire (bibliothèque tierce) → écrire
  explicitement "supposition".

## 2. Boucle de validation : goûter avant de dîner (Build ≈ après)

Pour chaque le doute bloquant/coûteux, considérez la hiérarchie de preuves :

1. **Lire le code / la doc source** (réponse la plus fiable, pas cher).
2. **Construire une petite spé pour observer le comportement réel** : script
   jetable, test unitaire en échouant espéré, trace.
3. **Tester en zone de staging / chez un homologue** : prouver le comportement
   réel.
4. **Demander à un humain concerné** (ticket, canal d'équipe, responsable du
   code) — en dernier recours si coûteux.

Règle de frugalité : si une étude du code (étape 1) suffit, ne pas écrire de
code. Un doute réglé par la lecture coûte 3 minutes ; réglé par un script, 30 ;
en prod, des jours.

### 2.1 Exemple en session
```
[D3] "API idyllique : un 200 retourne toujours du JSON valide"
→ Trace instrumenté sur les appels déjà en prod ? S'il manque,
   script de spike appelant 1 000 fois, logs ? ATTENTION timeout.
```

## 3. Après la validation : le codage discipliné

- Si validé : codez avec la certitude en main, un commentaire référençant la
  preuve et la date.
- Si réfuté : réécrivez le plan avec la nouvelle vérité, ajoutez un test qui
  documente la réalité.
- Si indéterminé : gardez la branche défensive, notez "ici dépend de D…", et
  passez au doute suivant.

## 4. Le journal des doutes (runtime)

Tenir par défaut un journal central (Markdown ou ticket) :

```
## 2026-XX-XX — module de paiement
| ID | Doute formulé | Statut | Preuve / décison | Date |
|----|----------------|--------|-------------------|------|
| D1 | Le callback existe toujours | validé | logs staging | 22/10 |
| D2 | date de péremption UTC | réfuté | test 5 ms | 22/10 |
| D3 | queue FIFO | coût, traité | axutoscaling OK |     |
```

Statuts : `ouvert`, `bloqué (attente info)`, `validé (preuve)`, `réfuté (rip: prévision modifiée)`.

## 5. Anti-patterns à combattre

1. **Douter vaguement** ("je me méfie de cette partie") sans formuler le doute
   en hypothèse vérifiable → reformulez toujours : "X est vrai uniquement si Y".
2. **Sur-tester des évidences** (compiler la démo de la doc officielle) →
   prioriser les hypothèses qui changent le code.
3. **Coder pour connaître** (écrire tout le module "pour voir") → faire une
   expérience minimale d'abord.
4. **Doute zombie** : un doute réglé jamais clos → fermer le journal à chaque fin
   de session.
5. **Ambiguïté non écrite** : un doute non consigné est une hypothèse que
   l'équipe croira nuancée — consignez tout doute.

## 6. Sortie intermédiaire recommandée

À la fin d'une session : livrez un court résumé :

```
## Journal des doutes (date)
- valids : …
- réfutés : …
- ouverts : … (suivant, assigné à qui)
## Suite probable (2-5 étapes)
```

## 7. Dépasser le doute : valider les faits, pas les personnes

Règle d'édition : une hypothèse peut être réfutée sans que personne ait tort.
Citoyens : "le test montre X", pas "le codeur a raison/tort".
