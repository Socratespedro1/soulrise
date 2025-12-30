import { supabase, isSupabaseConfigured } from './supabase';

// Tipos
export interface StreakData {
  streak_count: number;
  last_active_date: string | null;
  best_streak: number;
}

// Obter data de hoje no formato YYYY-MM-DD
export const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Obter data de ontem no formato YYYY-MM-DD
export const getYesterdayDate = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

// Calcular novo streak baseado na última data ativa
export const calculateNewStreak = (lastActiveDate: string | null): number => {
  if (!lastActiveDate) return 1;

  const today = getTodayDate();
  const yesterday = getYesterdayDate();

  if (lastActiveDate === today) {
    // Já entrou hoje - não altera streak
    return -1; // Sinal para não atualizar
  } else if (lastActiveDate === yesterday) {
    // Entrou ontem - incrementa streak
    return 1; // Incrementar
  } else {
    // Não entrou ontem - reseta streak
    return 0; // Resetar para 1
  }
};

// Verificar e atualizar streak do usuário
export const checkAndUpdateStreak = async (userId: string): Promise<StreakData | null> => {
  if (!isSupabaseConfigured) {
    // Modo offline - usar localStorage
    return checkAndUpdateStreakOffline();
  }

  try {
    // Buscar dados atuais do perfil
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('streak_count, last_active_date, best_streak')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('Erro ao buscar streak:', fetchError);
      return null;
    }

    const today = getTodayDate();
    const lastActiveDate = profile.last_active_date;
    const currentStreak = profile.streak_count || 0;
    const bestStreak = profile.best_streak || 0;

    // Calcular novo streak
    const streakChange = calculateNewStreak(lastActiveDate);

    if (streakChange === -1) {
      // Já entrou hoje - não atualiza
      return {
        streak_count: currentStreak,
        last_active_date: lastActiveDate,
        best_streak: bestStreak
      };
    }

    let newStreak: number;
    if (streakChange === 0) {
      // Resetar streak
      newStreak = 1;
    } else {
      // Incrementar streak
      newStreak = currentStreak + 1;
    }

    // Atualizar best_streak se necessário
    const newBestStreak = Math.max(newStreak, bestStreak);

    // Atualizar no Supabase
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        streak_count: newStreak,
        last_active_date: today,
        best_streak: newBestStreak
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Erro ao atualizar streak:', updateError);
      return null;
    }

    // Verificar se atingiu marco e mostrar notificação
    checkStreakMilestone(newStreak);

    // Agendar lembrete para amanhã
    scheduleStreakReminder();

    return {
      streak_count: newStreak,
      last_active_date: today,
      best_streak: newBestStreak
    };
  } catch (error) {
    console.error('Erro ao verificar streak:', error);
    return null;
  }
};

// Modo offline - usar localStorage
const checkAndUpdateStreakOffline = (): StreakData => {
  const storedStreak = localStorage.getItem('soulrise_streak_data');
  const today = getTodayDate();

  if (!storedStreak) {
    // Primeiro acesso
    const newData: StreakData = {
      streak_count: 1,
      last_active_date: today,
      best_streak: 1
    };
    localStorage.setItem('soulrise_streak_data', JSON.stringify(newData));
    return newData;
  }

  const streakData: StreakData = JSON.parse(storedStreak);
  const streakChange = calculateNewStreak(streakData.last_active_date);

  if (streakChange === -1) {
    // Já entrou hoje
    return streakData;
  }

  let newStreak: number;
  if (streakChange === 0) {
    newStreak = 1;
  } else {
    newStreak = streakData.streak_count + 1;
  }

  const newBestStreak = Math.max(newStreak, streakData.best_streak);

  const newData: StreakData = {
    streak_count: newStreak,
    last_active_date: today,
    best_streak: newBestStreak
  };

  localStorage.setItem('soulrise_streak_data', JSON.stringify(newData));

  // Verificar marcos
  checkStreakMilestone(newStreak);
  scheduleStreakReminder();

  return newData;
};

// Verificar se atingiu marco e mostrar notificação de parabéns
const checkStreakMilestone = (streak: number) => {
  const milestones: { [key: number]: string } = {
    3: '✨ 3 dias seguidos. Estás a criar consistência.',
    7: '🔥 7 dias. Uma semana contigo mesmo. Continua.',
    14: '🌿 14 dias. O teu ritmo está a ficar forte.',
    30: '🏆 30 dias. Isto já é transformação real.'
  };

  if (milestones[streak]) {
    showNotification('Parabéns! 🎉', milestones[streak]);
  }
};

// Agendar lembrete para não perder o streak
const scheduleStreakReminder = () => {
  // Verificar se já agendou hoje
  const lastReminder = localStorage.getItem('soulrise_last_reminder_date');
  const today = getTodayDate();

  if (lastReminder === today) {
    return; // Já agendou hoje
  }

  // Marcar como agendado
  localStorage.setItem('soulrise_last_reminder_date', today);

  // Calcular tempo até às 20:00
  const now = new Date();
  const reminderTime = new Date();
  reminderTime.setHours(20, 0, 0, 0);

  // Se já passou das 20:00, agendar para amanhã
  if (now > reminderTime) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }

  const timeUntilReminder = reminderTime.getTime() - now.getTime();

  // Agendar notificação
  setTimeout(() => {
    const messages = [
      'Só um momento hoje e manténs a tua consistência ✨',
      'Passa na SoulRise por 2 minutos para manteres o teu streak 🌿',
      'Ainda vais a tempo de manter o teu streak hoje 🙏'
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showNotification('Lembrete gentil', randomMessage);
  }, timeUntilReminder);
};

// Mostrar notificação (usando Notification API ou fallback)
const showNotification = (title: string, body: string) => {
  // Verificar se o browser suporta notificações
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icon.svg',
      badge: '/icon.svg'
    });
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    // Pedir permissão
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/icon.svg',
          badge: '/icon.svg'
        });
      }
    });
  } else {
    // Fallback - mostrar alerta visual na UI
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('soulrise_notification', {
        detail: { title, body }
      });
      window.dispatchEvent(event);
    }
  }
};

// Buscar dados de streak do usuário
export const getStreakData = async (userId: string): Promise<StreakData | null> => {
  if (!isSupabaseConfigured) {
    // Modo offline
    const storedStreak = localStorage.getItem('soulrise_streak_data');
    if (storedStreak) {
      return JSON.parse(storedStreak);
    }
    return {
      streak_count: 0,
      last_active_date: null,
      best_streak: 0
    };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('streak_count, last_active_date, best_streak')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erro ao buscar streak:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar streak:', error);
    return null;
  }
};
