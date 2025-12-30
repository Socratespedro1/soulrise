import { supabase, isSupabaseConfigured } from './supabase';

export interface SavedAffirmation {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface SavedVerse {
  id: string;
  user_id: string;
  content: string;
  reference?: string;
  created_at: string;
}

export interface SavedReflection {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

/**
 * Guardar uma afirmação
 */
export async function saveAffirmation(userId: string, content: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    console.log('Supabase não configurado - usando modo offline');
    // Salvar no localStorage como fallback
    const saved = JSON.parse(localStorage.getItem('soulrise_saved_affirmations') || '[]');
    saved.push({ id: Date.now().toString(), user_id: userId, content, created_at: new Date().toISOString() });
    localStorage.setItem('soulrise_saved_affirmations', JSON.stringify(saved));
    return true;
  }

  try {
    const { error } = await supabase
      .from('saved_affirmations')
      .insert([{ user_id: userId, content }]);

    if (error) {
      console.error('Erro ao guardar afirmação:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao guardar afirmação:', error);
    return false;
  }
}

/**
 * Guardar um versículo
 */
export async function saveVerse(userId: string, content: string, reference?: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    console.log('Supabase não configurado - usando modo offline');
    const saved = JSON.parse(localStorage.getItem('soulrise_saved_verses') || '[]');
    saved.push({ id: Date.now().toString(), user_id: userId, content, reference, created_at: new Date().toISOString() });
    localStorage.setItem('soulrise_saved_verses', JSON.stringify(saved));
    return true;
  }

  try {
    const { error } = await supabase
      .from('saved_verses')
      .insert([{ user_id: userId, content, reference }]);

    if (error) {
      console.error('Erro ao guardar versículo:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao guardar versículo:', error);
    return false;
  }
}

/**
 * Guardar uma reflexão
 */
export async function saveReflection(userId: string, content: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    console.log('Supabase não configurado - usando modo offline');
    const saved = JSON.parse(localStorage.getItem('soulrise_saved_reflections') || '[]');
    saved.push({ id: Date.now().toString(), user_id: userId, content, created_at: new Date().toISOString() });
    localStorage.setItem('soulrise_saved_reflections', JSON.stringify(saved));
    return true;
  }

  try {
    const { error } = await supabase
      .from('saved_reflections')
      .insert([{ user_id: userId, content }]);

    if (error) {
      console.error('Erro ao guardar reflexão:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao guardar reflexão:', error);
    return false;
  }
}

/**
 * Buscar afirmações guardadas
 */
export async function getSavedAffirmations(userId: string): Promise<SavedAffirmation[]> {
  if (!isSupabaseConfigured) {
    const saved = JSON.parse(localStorage.getItem('soulrise_saved_affirmations') || '[]');
    return saved;
  }

  try {
    const { data, error } = await supabase
      .from('saved_affirmations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar afirmações:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar afirmações:', error);
    return [];
  }
}

/**
 * Buscar versículos guardados
 */
export async function getSavedVerses(userId: string): Promise<SavedVerse[]> {
  if (!isSupabaseConfigured) {
    const saved = JSON.parse(localStorage.getItem('soulrise_saved_verses') || '[]');
    return saved;
  }

  try {
    const { data, error } = await supabase
      .from('saved_verses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar versículos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar versículos:', error);
    return [];
  }
}

/**
 * Buscar reflexões guardadas
 */
export async function getSavedReflections(userId: string): Promise<SavedReflection[]> {
  if (!isSupabaseConfigured) {
    const saved = JSON.parse(localStorage.getItem('soulrise_saved_reflections') || '[]');
    return saved;
  }

  try {
    const { data, error } = await supabase
      .from('saved_reflections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar reflexões:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar reflexões:', error);
    return [];
  }
}

/**
 * Remover uma afirmação
 */
export async function deleteAffirmation(userId: string, affirmationId: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    const saved = JSON.parse(localStorage.getItem('soulrise_saved_affirmations') || '[]');
    const filtered = saved.filter((item: SavedAffirmation) => item.id !== affirmationId);
    localStorage.setItem('soulrise_saved_affirmations', JSON.stringify(filtered));
    return true;
  }

  try {
    const { error } = await supabase
      .from('saved_affirmations')
      .delete()
      .eq('id', affirmationId)
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao remover afirmação:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao remover afirmação:', error);
    return false;
  }
}

/**
 * Remover um versículo
 */
export async function deleteVerse(userId: string, verseId: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    const saved = JSON.parse(localStorage.getItem('soulrise_saved_verses') || '[]');
    const filtered = saved.filter((item: SavedVerse) => item.id !== verseId);
    localStorage.setItem('soulrise_saved_verses', JSON.stringify(filtered));
    return true;
  }

  try {
    const { error } = await supabase
      .from('saved_verses')
      .delete()
      .eq('id', verseId)
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao remover versículo:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao remover versículo:', error);
    return false;
  }
}

/**
 * Remover uma reflexão
 */
export async function deleteReflection(userId: string, reflectionId: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    const saved = JSON.parse(localStorage.getItem('soulrise_saved_reflections') || '[]');
    const filtered = saved.filter((item: SavedReflection) => item.id !== reflectionId);
    localStorage.setItem('soulrise_saved_reflections', JSON.stringify(filtered));
    return true;
  }

  try {
    const { error } = await supabase
      .from('saved_reflections')
      .delete()
      .eq('id', reflectionId)
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao remover reflexão:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao remover reflexão:', error);
    return false;
  }
}

/**
 * Contar conteúdos guardados
 */
export async function countSavedContent(userId: string): Promise<{
  affirmations: number;
  verses: number;
  reflections: number;
}> {
  if (!isSupabaseConfigured) {
    const affirmations = JSON.parse(localStorage.getItem('soulrise_saved_affirmations') || '[]');
    const verses = JSON.parse(localStorage.getItem('soulrise_saved_verses') || '[]');
    const reflections = JSON.parse(localStorage.getItem('soulrise_saved_reflections') || '[]');
    
    return {
      affirmations: affirmations.length,
      verses: verses.length,
      reflections: reflections.length,
    };
  }

  try {
    const [affirmationsRes, versesRes, reflectionsRes] = await Promise.all([
      supabase.from('saved_affirmations').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('saved_verses').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('saved_reflections').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    ]);

    return {
      affirmations: affirmationsRes.count || 0,
      verses: versesRes.count || 0,
      reflections: reflectionsRes.count || 0,
    };
  } catch (error) {
    console.error('Erro ao contar conteúdos:', error);
    return { affirmations: 0, verses: 0, reflections: 0 };
  }
}
