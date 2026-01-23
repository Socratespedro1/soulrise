import { createClient } from '@supabase/supabase-js';

// Validação das variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || '';

// Verificar se as credenciais são válidas
const isValidConfig = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') && 
  supabaseUrl.includes('.supabase.co') &&
  supabaseAnonKey.length > 100;

// Criar cliente Supabase com configuração válida ou placeholder seguro
export const supabase = isValidConfig 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        flowType: 'pkce',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
      global: {
        headers: {
          'X-Client-Info': 'soulrise-app'
        }
      }
    })
  : createClient(
      'https://placeholder.supabase.co', 
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder', 
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    );

// Cliente admin com Service Role Key (para operações administrativas)
export const supabaseAdmin = (supabaseUrl && supabaseServiceKey && isValidConfig)
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Flag para verificar se o Supabase está configurado corretamente
export const isSupabaseConfigured = isValidConfig;

// Flag para verificar se o Service Role Key está disponível
export const hasServiceRoleKey = !!(supabaseUrl && supabaseServiceKey && isValidConfig);

// Modo offline - autenticação local simulada
export const offlineAuth = {
  signUp: async (email: string, password: string) => {
    // Simular cadastro local
    const users = JSON.parse(localStorage.getItem('soulrise_offline_users') || '[]');
    
    // Verificar se usuário já existe
    if (users.find((u: any) => u.email === email)) {
      throw new Error('Este email já está registado. Tenta fazer login.');
    }
    
    // Adicionar novo usuário
    const newUser = { 
      id: Date.now().toString(), 
      email, 
      password, // Em produção, isso seria hasheado
      created_at: new Date().toISOString() 
    };
    users.push(newUser);
    localStorage.setItem('soulrise_offline_users', JSON.stringify(users));
    localStorage.setItem('soulrise_offline_session', JSON.stringify(newUser));
    
    return { user: newUser, error: null };
  },
  
  signIn: async (email: string, password: string) => {
    // Simular login local
    const users = JSON.parse(localStorage.getItem('soulrise_offline_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Email ou senha incorretos. Tenta novamente.');
    }
    
    localStorage.setItem('soulrise_offline_session', JSON.stringify(user));
    return { user, error: null };
  },
  
  getSession: () => {
    const session = localStorage.getItem('soulrise_offline_session');
    return session ? { user: JSON.parse(session) } : { user: null };
  },
  
  signOut: () => {
    localStorage.removeItem('soulrise_offline_session');
  }
};
