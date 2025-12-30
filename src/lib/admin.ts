import { supabase, isSupabaseConfigured } from './supabase';

// Lista de emails de admin (modo offline e fallback)
const ADMIN_EMAILS = [
  'admin@soulrise.com',
  // Adicione mais emails de admin aqui conforme necessário
];

// Verificar se um email é admin
export const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

// Verificar se o usuário atual é admin
export const checkIsAdmin = async (): Promise<boolean> => {
  try {
    // MODO RÁPIDO: Verificar localStorage primeiro (para acesso imediato)
    const quickAdmin = localStorage.getItem('soulrise_quick_admin');
    if (quickAdmin === 'true') {
      return true;
    }

    if (isSupabaseConfigured) {
      // Modo online - verificar no Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.email) return false;

      // Verificar na tabela admins
      const { data, error } = await supabase
        .from('admins')
        .select('email')
        .eq('email', user.email.toLowerCase())
        .single();

      if (error) {
        // Se tabela não existe ou erro, usar lista local
        return isAdminEmail(user.email);
      }

      return !!data;
    } else {
      // Modo offline - verificar sessão local
      const session = localStorage.getItem('soulrise_offline_session');
      if (!session) return false;

      const user = JSON.parse(session);
      return isAdminEmail(user.email);
    }
  } catch (error) {
    console.error('Erro ao verificar admin:', error);
    return false;
  }
};

// NOVA FUNÇÃO: Ativar modo admin rápido
export const enableQuickAdmin = (): void => {
  localStorage.setItem('soulrise_quick_admin', 'true');
  console.log('✅ Modo Admin Ativado! Recarregue a página.');
};

// NOVA FUNÇÃO: Desativar modo admin rápido
export const disableQuickAdmin = (): void => {
  localStorage.removeItem('soulrise_quick_admin');
  console.log('❌ Modo Admin Desativado! Recarregue a página.');
};

// Obter email do usuário atual
export const getCurrentUserEmail = async (): Promise<string | null> => {
  try {
    if (isSupabaseConfigured) {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.email || null;
    } else {
      const session = localStorage.getItem('soulrise_offline_session');
      if (!session) return null;
      const user = JSON.parse(session);
      return user.email || null;
    }
  } catch (error) {
    console.error('Erro ao obter email do usuário:', error);
    return null;
  }
};

// Adicionar admin (apenas para admins existentes)
export const addAdmin = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const isCurrentUserAdmin = await checkIsAdmin();
    if (!isCurrentUserAdmin) {
      return { success: false, error: 'Apenas admins podem adicionar novos admins' };
    }

    if (isSupabaseConfigured) {
      // Adicionar no Supabase
      const { error } = await supabase
        .from('admins')
        .insert({ email: email.toLowerCase() });

      if (error) {
        return { success: false, error: error.message };
      }
    } else {
      // Modo offline - adicionar à lista local
      const admins = JSON.parse(localStorage.getItem('soulrise_offline_admins') || '[]');
      if (!admins.includes(email.toLowerCase())) {
        admins.push(email.toLowerCase());
        localStorage.setItem('soulrise_offline_admins', JSON.stringify(admins));
      }
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Remover admin
export const removeAdmin = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const isCurrentUserAdmin = await checkIsAdmin();
    if (!isCurrentUserAdmin) {
      return { success: false, error: 'Apenas admins podem remover admins' };
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('email', email.toLowerCase());

      if (error) {
        return { success: false, error: error.message };
      }
    } else {
      // Modo offline
      const admins = JSON.parse(localStorage.getItem('soulrise_offline_admins') || '[]');
      const filtered = admins.filter((e: string) => e !== email.toLowerCase());
      localStorage.setItem('soulrise_offline_admins', JSON.stringify(filtered));
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
