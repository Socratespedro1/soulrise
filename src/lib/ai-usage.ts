import { supabase, isSupabaseConfigured } from './supabase';

export interface AIUsageData {
  questionsCount: number;
  questionsRemaining: number;
  hasReachedLimit: boolean;
  isPremium: boolean;
}

const FREE_DAILY_LIMIT = 5;

/**
 * Obter dados de uso da IA para o utilizador
 */
export async function getAIUsage(userId: string, isPremium: boolean): Promise<AIUsageData> {
  // Se é Premium, retorna uso ilimitado
  if (isPremium) {
    return {
      questionsCount: 0,
      questionsRemaining: Infinity,
      hasReachedLimit: false,
      isPremium: true
    };
  }

  // Se Supabase não está configurado, usa localStorage
  if (!isSupabaseConfigured) {
    return getAIUsageOffline();
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    // Buscar ou criar registro de uso
    const { data: usage, error } = await supabase
      .from('ai_usage')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar uso da IA:', error);
      return getAIUsageOffline();
    }

    // Se não existe registro, criar um novo
    if (!usage) {
      const { data: newUsage, error: insertError } = await supabase
        .from('ai_usage')
        .insert({
          user_id: userId,
          questions_count: 0,
          last_reset_date: today
        })
        .select()
        .single();

      if (insertError) {
        console.error('Erro ao criar registro de uso:', insertError);
        return getAIUsageOffline();
      }

      return {
        questionsCount: 0,
        questionsRemaining: FREE_DAILY_LIMIT,
        hasReachedLimit: false,
        isPremium: false
      };
    }

    // Verificar se precisa resetar o contador (novo dia)
    if (usage.last_reset_date !== today) {
      const { data: resetUsage, error: updateError } = await supabase
        .from('ai_usage')
        .update({
          questions_count: 0,
          last_reset_date: today,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('Erro ao resetar contador:', updateError);
        return getAIUsageOffline();
      }

      return {
        questionsCount: 0,
        questionsRemaining: FREE_DAILY_LIMIT,
        hasReachedLimit: false,
        isPremium: false
      };
    }

    // Retornar dados atuais
    const questionsCount = usage.questions_count || 0;
    const questionsRemaining = Math.max(0, FREE_DAILY_LIMIT - questionsCount);
    const hasReachedLimit = questionsCount >= FREE_DAILY_LIMIT;

    return {
      questionsCount,
      questionsRemaining,
      hasReachedLimit,
      isPremium: false
    };
  } catch (error) {
    console.error('Erro ao obter uso da IA:', error);
    return getAIUsageOffline();
  }
}

/**
 * Incrementar contador de perguntas
 */
export async function incrementAIUsage(userId: string, isPremium: boolean): Promise<AIUsageData> {
  // Se é Premium, não incrementa
  if (isPremium) {
    return {
      questionsCount: 0,
      questionsRemaining: Infinity,
      hasReachedLimit: false,
      isPremium: true
    };
  }

  // Se Supabase não está configurado, usa localStorage
  if (!isSupabaseConfigured) {
    return incrementAIUsageOffline();
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    // Buscar registro atual
    const { data: usage, error } = await supabase
      .from('ai_usage')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar uso da IA:', error);
      return incrementAIUsageOffline();
    }

    // Se não existe, criar com 1 pergunta
    if (!usage) {
      const { data: newUsage, error: insertError } = await supabase
        .from('ai_usage')
        .insert({
          user_id: userId,
          questions_count: 1,
          last_reset_date: today
        })
        .select()
        .single();

      if (insertError) {
        console.error('Erro ao criar registro:', insertError);
        return incrementAIUsageOffline();
      }

      return {
        questionsCount: 1,
        questionsRemaining: FREE_DAILY_LIMIT - 1,
        hasReachedLimit: false,
        isPremium: false
      };
    }

    // Verificar se precisa resetar (novo dia)
    let newCount = usage.questions_count || 0;
    if (usage.last_reset_date !== today) {
      newCount = 1;
    } else {
      newCount += 1;
    }

    // Atualizar contador
    const { data: updatedUsage, error: updateError } = await supabase
      .from('ai_usage')
      .update({
        questions_count: newCount,
        last_reset_date: today,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Erro ao atualizar contador:', updateError);
      return incrementAIUsageOffline();
    }

    const questionsRemaining = Math.max(0, FREE_DAILY_LIMIT - newCount);
    const hasReachedLimit = newCount >= FREE_DAILY_LIMIT;

    return {
      questionsCount: newCount,
      questionsRemaining,
      hasReachedLimit,
      isPremium: false
    };
  } catch (error) {
    console.error('Erro ao incrementar uso:', error);
    return incrementAIUsageOffline();
  }
}

/**
 * Fallback offline usando localStorage
 */
function getAIUsageOffline(): AIUsageData {
  const today = new Date().toISOString().split('T')[0];
  const stored = localStorage.getItem('soulrise_ai_usage');
  
  if (!stored) {
    return {
      questionsCount: 0,
      questionsRemaining: FREE_DAILY_LIMIT,
      hasReachedLimit: false,
      isPremium: false
    };
  }

  const data = JSON.parse(stored);
  
  // Resetar se é um novo dia
  if (data.date !== today) {
    localStorage.setItem('soulrise_ai_usage', JSON.stringify({
      date: today,
      count: 0
    }));
    return {
      questionsCount: 0,
      questionsRemaining: FREE_DAILY_LIMIT,
      hasReachedLimit: false,
      isPremium: false
    };
  }

  const questionsCount = data.count || 0;
  const questionsRemaining = Math.max(0, FREE_DAILY_LIMIT - questionsCount);
  const hasReachedLimit = questionsCount >= FREE_DAILY_LIMIT;

  return {
    questionsCount,
    questionsRemaining,
    hasReachedLimit,
    isPremium: false
  };
}

function incrementAIUsageOffline(): AIUsageData {
  const today = new Date().toISOString().split('T')[0];
  const stored = localStorage.getItem('soulrise_ai_usage');
  
  let newCount = 1;
  
  if (stored) {
    const data = JSON.parse(stored);
    if (data.date === today) {
      newCount = (data.count || 0) + 1;
    }
  }

  localStorage.setItem('soulrise_ai_usage', JSON.stringify({
    date: today,
    count: newCount
  }));

  const questionsRemaining = Math.max(0, FREE_DAILY_LIMIT - newCount);
  const hasReachedLimit = newCount >= FREE_DAILY_LIMIT;

  return {
    questionsCount: newCount,
    questionsRemaining,
    hasReachedLimit,
    isPremium: false
  };
}
