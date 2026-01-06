import { supabase, isSupabaseConfigured } from './supabase';

export interface UserOnboarding {
  id: string;
  user_id: string;
  quiz_completed: boolean;
  quiz_completed_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Verifica se o utilizador já completou o quiz
 * Retorna true se quiz_completed = true, false caso contrário
 */
export async function checkQuizCompleted(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    // Modo offline - verificar localStorage
    const quizDone = localStorage.getItem('quiz_done');
    return quizDone === 'true';
  }

  try {
    // Buscar registo do utilizador
    const { data, error } = await supabase
      .from('user_onboarding')
      .select('quiz_completed')
      .eq('user_id', userId)
      .single();

    if (error) {
      // Se não existir registo, criar um novo com quiz_completed = false
      if (error.code === 'PGRST116') {
        await createOnboardingRecord(userId);
        return false;
      }
      console.error('Erro ao verificar quiz:', error);
      return false;
    }

    return data?.quiz_completed || false;
  } catch (error) {
    console.error('Erro ao verificar quiz:', error);
    return false;
  }
}

/**
 * Cria um registo de onboarding para o utilizador
 */
export async function createOnboardingRecord(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    // Modo offline - não fazer nada
    return false;
  }

  try {
    const { error } = await supabase
      .from('user_onboarding')
      .insert([
        {
          user_id: userId,
          quiz_completed: false,
        },
      ]);

    if (error) {
      // Se já existir, ignorar erro
      if (error.code === '23505') {
        return true;
      }
      console.error('Erro ao criar registo de onboarding:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao criar registo de onboarding:', error);
    return false;
  }
}

/**
 * Marca o quiz como concluído
 */
export async function markQuizAsCompleted(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    // Modo offline - usar localStorage
    localStorage.setItem('quiz_done', 'true');
    return true;
  }

  try {
    const { error } = await supabase
      .from('user_onboarding')
      .upsert(
        {
          user_id: userId,
          quiz_completed: true,
          quiz_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id',
        }
      );

    if (error) {
      console.error('Erro ao marcar quiz como concluído:', error);
      return false;
    }

    // Também guardar no localStorage para compatibilidade
    localStorage.setItem('quiz_done', 'true');
    return true;
  } catch (error) {
    console.error('Erro ao marcar quiz como concluído:', error);
    return false;
  }
}

/**
 * Reseta o estado do quiz (para permitir refazer)
 */
export async function resetQuizStatus(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    // Modo offline - limpar localStorage
    localStorage.removeItem('quiz_done');
    return true;
  }

  try {
    const { error } = await supabase
      .from('user_onboarding')
      .update({
        quiz_completed: false,
        quiz_completed_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao resetar quiz:', error);
      return false;
    }

    // Também limpar localStorage
    localStorage.removeItem('quiz_done');
    return true;
  } catch (error) {
    console.error('Erro ao resetar quiz:', error);
    return false;
  }
}
