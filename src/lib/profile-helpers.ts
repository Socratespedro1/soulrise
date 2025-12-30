import { supabase, isSupabaseConfigured } from './supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  has_quiz: boolean;
  has_plan: boolean;
  goals?: string[];
  is_premium: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Busca ou cria o perfil do utilizador
 */
export async function getOrCreateProfile(userId: string, email: string, fullName?: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured) {
    console.log('Supabase não configurado - usando modo offline');
    return null;
  }

  try {
    // Buscar perfil existente
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingProfile) {
      return existingProfile;
    }

    // Se não existir, criar novo perfil
    if (fetchError && fetchError.code === 'PGRST116') {
      const newProfile: Partial<UserProfile> = {
        id: userId,
        email,
        full_name: fullName || email.split('@')[0],
        has_quiz: false,
        has_plan: false,
        is_premium: false,
      };

      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      if (createError) {
        console.error('Erro ao criar perfil:', createError);
        return null;
      }

      return createdProfile;
    }

    console.error('Erro ao buscar perfil:', fetchError);
    return null;
  } catch (error) {
    console.error('Erro ao buscar/criar perfil:', error);
    return null;
  }
}

/**
 * Atualiza o perfil após completar o quiz
 */
export async function updateProfileAfterQuiz(userId: string, goals: string[]): Promise<boolean> {
  if (!isSupabaseConfigured) {
    console.log('Supabase não configurado - usando modo offline');
    return false;
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        has_quiz: true,
        has_plan: true,
        goals,
      })
      .eq('id', userId);

    if (error) {
      console.error('Erro ao atualizar perfil:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return false;
  }
}

/**
 * Reseta o plano do utilizador (para recriar)
 */
export async function resetUserPlan(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    console.log('Supabase não configurado - usando modo offline');
    return false;
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        has_quiz: false,
        has_plan: false,
      })
      .eq('id', userId);

    if (error) {
      console.error('Erro ao resetar plano:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao resetar plano:', error);
    return false;
  }
}

/**
 * Verifica se o utilizador tem plano
 */
export async function checkUserHasPlan(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    // Modo offline - verificar localStorage
    const hasGoals = localStorage.getItem('soulrise_user_goals');
    const hasPlan = localStorage.getItem('soulrise_personalized_plan');
    return !!(hasGoals && hasPlan);
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('has_plan')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erro ao verificar plano:', error);
      return false;
    }

    return data?.has_plan || false;
  } catch (error) {
    console.error('Erro ao verificar plano:', error);
    return false;
  }
}
