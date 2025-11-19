# 🔧 Guide de Migration TypeScript Strict

## État Actuel

TypeScript strict est **désactivé** pour permettre une migration progressive sans casser le code existant.

## Plan de Migration Progressive

### Phase 1 : Options Actives ✅

- ✅ `noUnusedLocals: true` - Détecte les variables non utilisées
- ✅ `noUnusedParameters: true` - Détecte les paramètres non utilisés
- ✅ `noFallthroughCasesInSwitch: true` - Empêche les bugs dans les switch

### Phase 2 : Options à Activer (Après corrections)

#### 1. `strictNullChecks: true`
**Impact :** Détecte les erreurs null/undefined potentielles

**Corrections nécessaires :**
```typescript
// ❌ Avant
const user = getUser(); // Peut être null
user.name; // Erreur si strictNullChecks activé

// ✅ Après
const user = getUser();
if (user) {
  user.name; // OK
}
// Ou
const userName = user?.name; // Optional chaining
```

#### 2. `noImplicitAny: true`
**Impact :** Force la déclaration explicite des types

**Corrections nécessaires :**
```typescript
// ❌ Avant
function process(data) { // 'any' implicite
  return data.value;
}

// ✅ Après
function process(data: { value: string }) {
  return data.value;
}
```

#### 3. `strict: true`
**Impact :** Active toutes les vérifications strictes

**Inclut :**
- `strictNullChecks`
- `strictFunctionTypes`
- `strictBindCallApply`
- `strictPropertyInitialization`
- `noImplicitThis`
- `alwaysStrict`

## Commandes Utiles

### Vérifier les erreurs TypeScript
```bash
npx tsc --noEmit
```

### Compter les erreurs par type
```bash
npx tsc --noEmit 2>&1 | grep -c "error TS"
```

### Activer progressivement
1. Activer une option à la fois
2. Corriger toutes les erreurs
3. Passer à l'option suivante

## Recommandations

1. **Ne pas activer tout d'un coup** - Trop d'erreurs à corriger
2. **Corriger par fichier** - Plus facile à gérer
3. **Utiliser `// @ts-ignore` temporairement** - Pour les cas complexes
4. **Documenter les décisions** - Pour les futurs développeurs

## Prochaines Étapes

1. ✅ Activer `noUnusedLocals` et `noUnusedParameters` (FAIT)
2. 🔄 Corriger les erreurs `noUnusedLocals/Parameters`
3. ⏳ Activer `strictNullChecks`
4. ⏳ Corriger les erreurs null/undefined
5. ⏳ Activer `noImplicitAny`
6. ⏳ Corriger les erreurs any implicites
7. ⏳ Activer `strict: true`
8. ⏳ Corriger les erreurs restantes

---

**Date de création :** $(date)  
**Dernière mise à jour :** $(date)

