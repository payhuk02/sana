# 🔧 Correction - Sauvegarde Logo et Bannière

**Date:** $(date)  
**Problème:** Le logo et la bannière n'étaient pas sauvegardés et mis à jour correctement dans la base de données.

---

## 🔍 Analyse du Problème

### Problème Identifié

La fonction `updateSettings` dans `SiteSettingsContext.tsx` utilisait `.update()` sans condition WHERE :

```typescript
// ❌ CODE PROBLÉMATIQUE
const { error } = await supabase
  .from('site_settings')
  .update(updated)
  .limit(1); // ❌ Ne fonctionne pas sans WHERE clause
```

**Pourquoi cela ne fonctionnait pas ?**
- Supabase/PostgreSQL exige une condition WHERE pour les opérations UPDATE
- `.limit(1)` n'est pas une condition WHERE valide
- L'opération échouait silencieusement ou ne mettait à jour aucune ligne

### Autres Problèmes Détectés

1. **Gestion d'erreurs insuffisante** : `handleChange` n'attendait pas `updateSettings` et ne gérait pas les erreurs
2. **Pas de vérification de l'existence de la ligne** : Le code supposait qu'une ligne existait toujours
3. **Pas de fallback** : Si la table était vide, l'update échouait

---

## ✅ Solution Implémentée

### 1. Correction de `updateSettings` dans `SiteSettingsContext.tsx`

**Nouvelle approche :**
1. Récupérer d'abord l'ID de la ligne existante (si elle existe)
2. Si une ligne existe avec un ID → faire un UPDATE avec `.eq('id', id)`
3. Si aucune ligne n'existe → utiliser UPSERT pour créer/mettre à jour
4. Gestion robuste des erreurs avec fallback

```typescript
// ✅ CODE CORRIGÉ
const updateSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
  try {
    const updated = { ...settings, ...newSettings };
    
    // Récupérer l'ID de la ligne existante
    const { data: existingData, error: fetchError } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1)
      .maybeSingle(); // Retourne null si aucune ligne n'existe
    
    let error;
    if (existingData?.id) {
      // UPDATE avec condition WHERE
      const { error: updateError } = await supabase
        .from('site_settings')
        .update(updated)
        .eq('id', existingData.id); // ✅ Condition WHERE valide
      error = updateError;
    } else {
      // UPSERT si aucune ligne n'existe
      const { error: upsertError } = await supabase
        .from('site_settings')
        .upsert(updated, { onConflict: 'id' });
      error = upsertError;
      
      // Fallback si onConflict échoue
      if (error && error.message?.includes('onConflict')) {
        const { error: upsertError2 } = await supabase
          .from('site_settings')
          .upsert(updated);
        error = upsertError2;
      }
    }
    
    if (error) throw error;
    
    setSettings(updated);
    logger.info('Site settings updated successfully', 'SiteSettingsContext');
  } catch (error) {
    logger.error('Failed to update site settings', error, 'SiteSettingsContext');
    throw error;
  }
}, [settings]);
```

### 2. Amélioration de la Gestion d'Erreurs dans `SiteSettings.tsx`

**Avant :**
```typescript
// ❌ Pas de gestion d'erreurs
const handleChange = (field: string, value: string) => {
  updateSettings({ [field]: value }); // Non-awaited, erreurs silencieuses
};
```

**Après :**
```typescript
// ✅ Gestion d'erreurs complète
const handleChange = async (field: string, value: string) => {
  try {
    await updateSettings({ [field]: value });
  } catch (error) {
    logger.error(`Error updating ${field}`, error, 'SiteSettings');
    toast.error(`Erreur lors de la mise à jour de ${field}`);
  }
};
```

### 3. Mise à Jour de `removeBanner` et `removeLogo`

Ces fonctions attendent maintenant `handleChange` et gèrent les erreurs :

```typescript
const removeBanner = async () => {
  try {
    await handleChange('hero_image', '');
    setBannerPreview(null);
    toast.success('Image de bannière supprimée');
  } catch (error) {
    // Error already handled in handleChange
  }
};
```

### 4. Script SQL de Correction

Un script SQL (`FIX_SITE_SETTINGS_TABLE.sql`) a été créé pour :
- Vérifier/créer la colonne `id` si elle n'existe pas
- S'assurer que la table a une clé primaire
- Vérifier que toutes les colonnes nécessaires existent
- Initialiser une ligne par défaut si la table est vide

---

## 📋 Fichiers Modifiés

1. **`src/contexts/SiteSettingsContext.tsx`**
   - Correction de `updateSettings` avec récupération d'ID et UPDATE avec WHERE
   - Ajout de fallback UPSERT si aucune ligne n'existe
   - Gestion robuste des erreurs

2. **`src/pages/admin/SiteSettings.tsx`**
   - `handleChange` est maintenant async et gère les erreurs
   - `removeBanner` et `removeLogo` attendent `handleChange`
   - Messages d'erreur affichés à l'utilisateur via toast

3. **`FIX_SITE_SETTINGS_TABLE.sql`** (nouveau)
   - Script SQL pour corriger/améliorer la structure de la table

---

## 🧪 Tests à Effectuer

### 1. Test d'Upload de Bannière
1. Aller dans Admin → Paramètres du site
2. Uploader une nouvelle bannière
3. Vérifier que :
   - ✅ Le toast "Image uploadée avec succès" s'affiche
   - ✅ La preview se met à jour immédiatement
   - ✅ Après rechargement de la page, la bannière est toujours là
   - ✅ La bannière s'affiche sur la page d'accueil

### 2. Test d'Upload de Logo
1. Uploader un nouveau logo
2. Vérifier que :
   - ✅ Le toast "Logo uploadé avec succès" s'affiche
   - ✅ La preview se met à jour immédiatement
   - ✅ Après rechargement, le logo est toujours là
   - ✅ Le logo s'affiche dans la navbar

### 3. Test de Suppression
1. Supprimer la bannière
2. Vérifier que :
   - ✅ Le toast "Image de bannière supprimée" s'affiche
   - ✅ La preview disparaît
   - ✅ Après rechargement, la bannière est toujours supprimée

### 4. Test de Mise à Jour Autre Champ
1. Modifier le nom du site
2. Vérifier que :
   - ✅ La modification est sauvegardée
   - ✅ Après rechargement, la modification persiste

---

## ⚠️ Action Requise

**IMPORTANT :** Exécuter le script SQL `FIX_SITE_SETTINGS_TABLE.sql` dans l'éditeur SQL de Supabase pour s'assurer que :
- La table a une colonne `id` avec clé primaire
- Toutes les colonnes nécessaires existent
- Une ligne par défaut existe si la table est vide

---

## 📊 Résultat Attendu

Après ces corrections :
- ✅ Le logo et la bannière sont **correctement sauvegardés** dans Supabase
- ✅ Les modifications sont **immédiatement visibles** dans l'interface admin
- ✅ Les modifications **persistent après rechargement**
- ✅ Les erreurs sont **affichées à l'utilisateur** via des toasts
- ✅ Les logs d'erreurs sont **enregistrés** pour le débogage

---

## 🔄 Flux de Sauvegarde Corrigé

1. **Upload Image** → Supabase Storage (`banner-images` ou `logo-images`)
2. **Récupération URL** → `getPublicUrl()`
3. **Mise à jour Settings** → `handleChange()` → `updateSettings()`
4. **Récupération ID** → `select('id').maybeSingle()`
5. **UPDATE/INSERT** → `.update().eq('id', id)` ou `.upsert()`
6. **Mise à jour State** → `setSettings(updated)`
7. **Synchronisation Realtime** → Subscription Realtime met à jour automatiquement
8. **Affichage** → Preview immédiate + affichage sur le site

---

**Status:** ✅ **CORRIGÉ**  
**Prochaine étape:** Tester les fonctionnalités et exécuter le script SQL si nécessaire

