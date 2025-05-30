# Guide des Anomalies de Chèques

Ce guide liste les différents types d'anomalies pouvant être détectées sur les chèques, leurs couleurs associées et des exemples de messages.

## Types d'Anomalies et Couleurs

### 1. Anomalies de Sécurité (Rouge)
- **Couleur**: `bg-red-100 text-red-800`
- **Exemples**:
  - "Filigrane manquant ou altéré"
  - "Micro-impression illisible"
  - "Éléments UV absents"
  - "Signature suspecte"
  - "Altération visible du chèque"

### 2. Anomalies de Montant (Orange)
- **Couleur**: `bg-orange-100 text-orange-800`
- **Exemples**:
  - "Incohérence entre montant en chiffres et en lettres"
  - "Montant supérieur au plafond autorisé"
  - "Montant illisible ou effacé"
  - "Montant modifié"

### 3. Anomalies de Date (Jaune)
- **Couleur**: `bg-yellow-100 text-yellow-800`
- **Exemples**:
  - "Date postérieure à la date limite"
  - "Date antérieure à la date d'émission"
  - "Date illisible ou effacée"
  - "Date modifiée"

### 4. Anomalies de Signature (Violet)
- **Couleur**: `bg-purple-100 text-purple-800`
- **Exemples**:
  - "Signature manquante"
  - "Signature différente de la signature de référence"
  - "Signature illisible"
  - "Signature effacée ou modifiée"

### 5. Anomalies de Format (Bleu)
- **Couleur**: `bg-blue-100 text-blue-800`
- **Exemples**:
  - "Format de chèque non standard"
  - "Numéro de chèque manquant ou incorrect"
  - "Coordonnées bancaires incomplètes"
  - "RIB illisible ou incorrect"

### 6. Autres Anomalies (Gris)
- **Couleur**: `bg-gray-100 text-gray-800`
- **Exemples**:
  - "Chèque endommagé"
  - "Taches ou salissures importantes"
  - "Informations manquantes"
  - "Problème non catégorisé"

### Chèques Sans Anomalies (Vert)
- **Couleur**: `bg-green-100 text-green-800`
- **Message**: "Aucune anomalie détectée"

## Niveaux de Sévérité

Chaque anomalie est associée à un niveau de sévérité :

1. **High (Élevé)**
   - Problèmes critiques nécessitant une intervention immédiate
   - Ex: Altération du chèque, signature frauduleuse

2. **Medium (Moyen)**
   - Problèmes importants mais non critiques
   - Ex: Incohérence de montant, date incorrecte

3. **Low (Faible)**
   - Problèmes mineurs
   - Ex: Légère salissure, format non standard

## Utilisation

Les anomalies sont utilisées pour :
1. Colorer les lignes dans les listes de chèques
2. Afficher des badges colorés dans le panneau de détails
3. Aider à la prise de décision pour la validation ou le rejet des chèques

## Bonnes Pratiques

1. Toujours vérifier les anomalies de sécurité en priorité
2. Documenter les raisons du rejet en cas d'anomalies critiques
3. Maintenir une cohérence dans l'utilisation des types d'anomalies
4. Mettre à jour régulièrement la liste des anomalies selon les nouvelles fraudes détectées 