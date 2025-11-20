import { supabase } from './supabase';
import { logger } from './logger';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  };
}

/**
 * Récupère le profil de l'utilisateur actuellement connecté
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // Si le profil n'existe pas, le créer avec les données de base
      if (error.code === 'PGRST116') {
        // Récupérer l'email depuis auth.users via la session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const newProfile: Partial<Profile> = {
            id: userId,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || '',
          };
          
          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();

          if (createError) {
            logger.error('Error creating profile', createError, 'profile');
            return null;
          }

          return createdProfile as Profile;
        }
      }
      logger.error('Error fetching profile', error, 'profile');
      return null;
    }

    return data as Profile;
  } catch (error) {
    logger.error('Failed to fetch profile', error, 'profile');
    return null;
  }
}

/**
 * Met à jour le profil de l'utilisateur
 */
export async function updateProfile(
  userId: string,
  updates: UpdateProfileData
): Promise<Profile | null> {
  try {
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Si address est fourni, s'assurer qu'il est bien formaté
    if (updates.address) {
      updateData.address = updates.address;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      logger.error('Error updating profile', error, 'profile');
      return null;
    }

    return data as Profile;
  } catch (error) {
    logger.error('Failed to update profile', error, 'profile');
    return null;
  }
}

/**
 * Met à jour le mot de passe de l'utilisateur
 */
export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ error: any }> {
  try {
    // Vérifier le mot de passe actuel en tentant une connexion
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return { error: { message: 'Utilisateur non trouvé' } };
    }

    // Tenter de se connecter avec l'ancien mot de passe pour vérifier
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (verifyError) {
      return { error: { message: 'Mot de passe actuel incorrect' } };
    }

    // Mettre à jour le mot de passe
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return { error: updateError };
    }

    return { error: null };
  } catch (error: any) {
    logger.error('Failed to update password', error, 'profile');
    return { error };
  }
}

