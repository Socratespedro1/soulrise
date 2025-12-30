/**
 * Sistema de Streak - SoulRise
 * Gerencia dias consecutivos de uso da aplicação
 */

import { supabase, isSupabaseConfigured } from './supabase';

export interface StreakData {
  streakCount: number;
  lastActiveDate: string | null;
  bestStreak: number;
}

/**
 * Calcula diferença em dias entre duas datas
 */
function getDaysDifference(date1: Date, date2: Date): number {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  const diffTime = d2.getTime() - d1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Obtém a data de hoje no formato YYYY-MM-DD
 */
function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Verifica e atualiza o streak do utilizador
 * Deve ser chamado sempre que o utilizador faz login
 */
export async function checkAndUpdateStreak(userId: string): Promise<StreakData> {
  try {
    const today = getTodayString();
    
    // Usar localStorage para streak (mais simples e confiável)
    return updateStreakOffline(today);
  } catch (error) {
    console.log('Erro no sistema de streak:', error);
    return updateStreakOffline(getTodayString());
  }
}

/**
 * Atualiza streak no modo offline (localStorage)
 */
function updateStreakOffline(today: string): StreakData {
  const stored = localStorage.getItem('soulrise_streak_data');
  let streakData: StreakData = {
    streakCount: 0,
    lastActiveDate: null,
    bestStreak: 0
  };

  if (stored) {
    streakData = JSON.parse(stored);
  }

  const lastActiveDate = streakData.lastActiveDate;

  if (!lastActiveDate) {
    // Primeiro acesso
    streakData.streakCount = 1;
    streakData.lastActiveDate = today;
    streakData.bestStreak = 1;
  } else if (lastActiveDate === today) {
    // Já entrou hoje - não altera
    return streakData;
  } else {
    const lastDate = new Date(lastActiveDate);
    const todayDate = new Date(today);
    const daysDiff = getDaysDifference(lastDate, todayDate);

    if (daysDiff === 1) {
      // Ontem - incrementa
      streakData.streakCount += 1;
    } else {
      // Perdeu - reinicia
      streakData.streakCount = 1;
    }

    streakData.lastActiveDate = today;

    // Atualizar best streak
    if (streakData.streakCount > streakData.bestStreak) {
      streakData.bestStreak = streakData.streakCount;
    }
  }

  // Verificar marcos
  checkStreakMilestone(streakData.streakCount);

  // Salvar
  saveStreakToLocalStorage(streakData);

  return streakData;
}

/**
 * Salva streak no localStorage
 */
function saveStreakToLocalStorage(data: StreakData): void {
  localStorage.setItem('soulrise_streak_data', JSON.stringify(data));
}

/**
 * Obtém dados do streak (para exibição)
 */
export async function getStreakData(userId?: string): Promise<StreakData> {
  try {
    // Usar localStorage para streak
    const stored = localStorage.getItem('soulrise_streak_data');
    if (stored) {
      return JSON.parse(stored);
    }
    return { streakCount: 0, lastActiveDate: null, bestStreak: 0 };
  } catch (error) {
    console.log('Erro ao obter streak:', error);
    return { streakCount: 0, lastActiveDate: null, bestStreak: 0 };
  }
}

/**
 * Verifica se atingiu um marco e mostra notificação
 */
function checkStreakMilestone(streakCount: number): void {
  const milestones: { [key: number]: string } = {
    3: '✨ 3 dias seguidos. Estás a criar consistência.',
    7: '🔥 7 dias. Uma semana contigo mesmo. Continua.',
    14: '🌿 14 dias. O teu ritmo está a ficar forte.',
    30: '🏆 30 dias. Isto já é transformação real.'
  };

  const message = milestones[streakCount];
  
  if (message) {
    // Verificar se já mostrou esta notificação
    const shownKey = `soulrise_milestone_${streakCount}_shown`;
    const alreadyShown = localStorage.getItem(shownKey);
    
    if (!alreadyShown) {
      // Mostrar notificação
      showStreakNotification(message);
      localStorage.setItem(shownKey, 'true');
    }
  }
}

/**
 * Mostra notificação de streak
 */
function showStreakNotification(message: string): void {
  // Verificar se notificações estão habilitadas
  const notificationsEnabled = localStorage.getItem('soulrise_notifications') !== 'false';
  
  if (!notificationsEnabled) {
    return;
  }

  // Usar Notification API se disponível
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('SoulRise - Parabéns! 🎉', {
      body: message,
      icon: '/icon.svg',
      badge: '/icon.svg'
    });
  } else {
    // Fallback: mostrar toast/alert customizado
    console.log('🎉 Streak Milestone:', message);
    
    // Disparar evento customizado para UI mostrar toast
    window.dispatchEvent(new CustomEvent('soulrise_streak_milestone', {
      detail: { message }
    }));
  }
}

/**
 * Solicita permissão para notificações
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Agenda lembrete diário (20:00)
 * Deve ser chamado quando o utilizador faz login
 */
export function scheduleDailyReminder(): void {
  // Verificar se notificações estão habilitadas
  const notificationsEnabled = localStorage.getItem('soulrise_notifications') !== 'false';
  
  if (!notificationsEnabled) {
    return;
  }

  // Calcular tempo até às 20:00
  const now = new Date();
  const reminder = new Date();
  reminder.setHours(20, 0, 0, 0);

  // Se já passou das 20:00, agendar para amanhã
  if (now > reminder) {
    reminder.setDate(reminder.getDate() + 1);
  }

  const timeUntilReminder = reminder.getTime() - now.getTime();

  // Agendar lembrete
  setTimeout(() => {
    checkAndSendReminder();
  }, timeUntilReminder);
}

/**
 * Verifica se deve enviar lembrete e envia
 */
async function checkAndSendReminder(): Promise<void> {
  const today = getTodayString();
  const streakData = await getStreakData();

  // Verificar se já entrou hoje
  if (streakData.lastActiveDate === today) {
    // Já entrou hoje - não enviar lembrete
    return;
  }

  // Enviar lembrete
  const messages = [
    'Só um momento hoje e manténs a tua consistência ✨',
    'Passa na SoulRise por 2 minutos para manteres o teu streak 🌿',
    'Ainda vais a tempo de manter o teu streak hoje 🙏'
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('SoulRise - Lembrete Gentil', {
      body: randomMessage,
      icon: '/icon.svg',
      badge: '/icon.svg'
    });
  }

  // Reagendar para amanhã
  setTimeout(() => {
    checkAndSendReminder();
  }, 24 * 60 * 60 * 1000); // 24 horas
}
