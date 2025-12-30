'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Target, 
  Crown, 
  Calendar, 
  CheckCircle2, 
  Flame, 
  Heart, 
  BookOpen, 
  Sparkles,
  Bell,
  BellOff,
  ArrowLeft,
  Settings,
  RefreshCw,
  Trash2,
  Trophy,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Camera,
  Edit2,
  Save,
  X,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/soulrise/Logo';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { resetUserPlan } from '@/lib/profile-helpers';
import { 
  getSavedAffirmations, 
  getSavedVerses, 
  getSavedReflections,
  deleteAffirmation,
  deleteVerse,
  deleteReflection,
  countSavedContent,
  SavedAffirmation,
  SavedVerse,
  SavedReflection
} from '@/lib/saved-content-helpers';

interface UserProfile {
  name: string;
  goals: string[];
  isPremium: boolean;
  activeDays: number;
  ritualCompletedToday: boolean;
  consistency: string;
  savedAffirmations: number;
  savedVerses: number;
  savedReflections: number;
  notificationsEnabled: boolean;
  focusPreference: 'balanced' | 'personal' | 'spiritual';
  streakCount: number;
  bestStreak: number;
  activeDates: string[]; // Array de datas no formato YYYY-MM-DD
  avatarUrl?: string;
}

export default function PerfilPage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Utilizador',
    goals: [],
    isPremium: false,
    activeDays: 0,
    ritualCompletedToday: false,
    consistency: 'Sem dados',
    savedAffirmations: 0,
    savedVerses: 0,
    savedReflections: 0,
    notificationsEnabled: true,
    focusPreference: 'balanced',
    streakCount: 0,
    bestStreak: 0,
    activeDates: [],
    avatarUrl: undefined
  });

  const [showRecreatePlanConfirm, setShowRecreatePlanConfirm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para visualizar conteúdos guardados
  const [showSavedContent, setShowSavedContent] = useState<'affirmations' | 'verses' | 'reflections' | null>(null);
  const [savedAffirmations, setSavedAffirmations] = useState<SavedAffirmation[]>([]);
  const [savedVerses, setSavedVerses] = useState<SavedVerse[]>([]);
  const [savedReflections, setSavedReflections] = useState<SavedReflection[]>([]);

  // Estado para o calendário
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  // Estados para edição de perfil
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    
    try {
      // Tentar obter ID do utilizador do Supabase
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            setUserId(session.user.id);
            await loadRealData(session.user.id, session.user.email || '');
          } else {
            loadLocalStorageData();
          }
        } catch {
          // Silenciosamente usar dados locais se falhar
          loadLocalStorageData();
        }
      } else {
        loadLocalStorageData();
      }
    } catch {
      // Silenciosamente usar dados locais se falhar
      loadLocalStorageData();
    } finally {
      setLoading(false);
    }
  };

  const loadRealData = async (uid: string, email: string) => {
    try {
      // Buscar dados do perfil no Supabase (apenas campos que existem)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, goals, is_premium, created_at, avatar_url')
        .eq('id', uid)
        .single();

      if (profileError) {
        loadLocalStorageData();
        return;
      }

      // Calcular dias ativos (diferença entre created_at e hoje)
      const createdAt = new Date(profileData.created_at);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - createdAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Buscar conteúdos guardados usando a nova função
      const counts = await countSavedContent(uid);

      // Buscar rituais completados
      const { data: ritualsData, error: ritualsError } = await supabase
        .from('completed_rituals')
        .select('completed_at')
        .eq('user_id', uid)
        .order('completed_at', { ascending: false });

      if (ritualsError) {
        // Continuar sem rituais se falhar
      }

      let ritualCompletedToday = false;
      let consecutiveDays = 0;
      const activeDates: string[] = [];

      if (ritualsData && ritualsData.length > 0) {
        // Verificar se completou hoje
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        const lastRitual = new Date(ritualsData[0].completed_at);
        ritualCompletedToday = lastRitual >= todayStart;

        // Calcular dias consecutivos e coletar datas ativas
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        for (const ritual of ritualsData) {
          const ritualDate = new Date(ritual.completed_at);
          ritualDate.setHours(0, 0, 0, 0);
          
          // Adicionar à lista de datas ativas (formato YYYY-MM-DD)
          const dateStr = ritualDate.toISOString().split('T')[0];
          if (!activeDates.includes(dateStr)) {
            activeDates.push(dateStr);
          }
          
          if (ritualDate.getTime() === currentDate.getTime()) {
            consecutiveDays++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else {
            break;
          }
        }
      }

      const consistency = consecutiveDays > 0 
        ? `${consecutiveDays} ${consecutiveDays === 1 ? 'dia seguido' : 'dias seguidos'}`
        : 'Sem sequência ativa';

      // Calcular streak a partir dos rituais completados
      let streakCount = 0;
      let bestStreak = 0;
      
      if (ritualsData && ritualsData.length > 0) {
        let currentStreak = 0;
        let tempBestStreak = 0;
        let lastDate = new Date();
        lastDate.setHours(0, 0, 0, 0);
        
        for (const ritual of ritualsData) {
          const ritualDate = new Date(ritual.completed_at);
          ritualDate.setHours(0, 0, 0, 0);
          
          const diffDays = Math.floor((lastDate.getTime() - ritualDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 0 || diffDays === 1) {
            currentStreak++;
            tempBestStreak = Math.max(tempBestStreak, currentStreak);
            lastDate = ritualDate;
          } else {
            break;
          }
        }
        
        streakCount = currentStreak;
        bestStreak = tempBestStreak;
      }

      // Atualizar estado com dados reais
      setProfile({
        name: profileData.full_name || email.split('@')[0],
        goals: profileData.goals || [],
        isPremium: profileData.is_premium || false,
        activeDays: diffDays,
        ritualCompletedToday,
        consistency,
        savedAffirmations: counts.affirmations,
        savedVerses: counts.verses,
        savedReflections: counts.reflections,
        notificationsEnabled: true,
        focusPreference: 'balanced',
        streakCount,
        bestStreak,
        activeDates,
        avatarUrl: profileData.avatar_url
      });

      // Carregar preferências do localStorage
      const savedNotifications = localStorage.getItem('soulrise_notifications');
      const savedFocus = localStorage.getItem('soulrise_focus_preference');
      
      if (savedNotifications !== null) {
        setProfile(prev => ({ ...prev, notificationsEnabled: savedNotifications === 'true' }));
      }
      
      if (savedFocus) {
        setProfile(prev => ({ ...prev, focusPreference: savedFocus as any }));
      }

    } catch {
      // Silenciosamente usar dados locais se falhar
      loadLocalStorageData();
    }
  };

  const loadLocalStorageData = async () => {
    // Carregar dados do localStorage como fallback
    const savedName = localStorage.getItem('soulrise_user_name');
    const savedPlan = localStorage.getItem('soulrise_personalized_plan');
    const savedAvatar = localStorage.getItem('soulrise_avatar_url');
    
    if (savedName) {
      setProfile(prev => ({ ...prev, name: savedName }));
    }
    
    if (savedPlan) {
      const plan = JSON.parse(savedPlan);
      if (plan.goals) {
        setProfile(prev => ({ ...prev, goals: plan.goals }));
      }
    }

    if (savedAvatar) {
      setProfile(prev => ({ ...prev, avatarUrl: savedAvatar }));
    }

    // Carregar contadores do localStorage
    const affirmations = JSON.parse(localStorage.getItem('soulrise_saved_affirmations') || '[]');
    const verses = JSON.parse(localStorage.getItem('soulrise_saved_verses') || '[]');
    const reflections = JSON.parse(localStorage.getItem('soulrise_saved_reflections') || '[]');
    
    // Calcular streak do localStorage
    const ritualsHistory = JSON.parse(localStorage.getItem('soulrise_rituals_history') || '[]');
    let streakCount = 0;
    let bestStreak = 0;
    
    if (ritualsHistory.length > 0) {
      let currentStreak = 0;
      let tempBestStreak = 0;
      let lastDate = new Date();
      lastDate.setHours(0, 0, 0, 0);
      
      for (const ritualDate of ritualsHistory) {
        const date = new Date(ritualDate);
        date.setHours(0, 0, 0, 0);
        
        const diffDays = Math.floor((lastDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0 || diffDays === 1) {
          currentStreak++;
          tempBestStreak = Math.max(tempBestStreak, currentStreak);
          lastDate = date;
        } else {
          break;
        }
      }
      
      streakCount = currentStreak;
      bestStreak = tempBestStreak;
    }
    
    // Carregar datas ativas do localStorage
    const activeDates = JSON.parse(localStorage.getItem('soulrise_active_dates') || '[]');
    
    setProfile(prev => ({
      ...prev,
      savedAffirmations: affirmations.length,
      savedVerses: verses.length,
      savedReflections: reflections.length,
      streakCount,
      bestStreak,
      activeDates
    }));

    // Carregar preferências
    const savedNotifications = localStorage.getItem('soulrise_notifications');
    const savedFocus = localStorage.getItem('soulrise_focus_preference');
    
    if (savedNotifications !== null) {
      setProfile(prev => ({ ...prev, notificationsEnabled: savedNotifications === 'true' }));
    }
    
    if (savedFocus) {
      setProfile(prev => ({ ...prev, focusPreference: savedFocus as any }));
    }
  };

  const toggleNotifications = () => {
    const newValue = !profile.notificationsEnabled;
    setProfile(prev => ({ ...prev, notificationsEnabled: newValue }));
    localStorage.setItem('soulrise_notifications', String(newValue));
  };

  const updateFocusPreference = (preference: 'balanced' | 'personal' | 'spiritual') => {
    setProfile(prev => ({ ...prev, focusPreference: preference }));
    localStorage.setItem('soulrise_focus_preference', preference);
  };

  const handleRecreatePlan = async () => {
    // Resetar no Supabase se configurado
    if (userId && isSupabaseConfigured) {
      await resetUserPlan(userId);
    }

    // Limpar localStorage
    localStorage.removeItem('soulrise_user_goals');
    localStorage.removeItem('soulrise_personalized_plan');

    // Disparar evento customizado para reiniciar o questionário
    window.dispatchEvent(new Event('soulrise_recreate_plan'));
    
    // Redirecionar para a página principal
    window.location.href = '/';
  };

  const getFocusLabel = (pref: string) => {
    switch (pref) {
      case 'personal': return 'Desenvolvimento Pessoal';
      case 'spiritual': return 'Espiritualidade';
      default: return 'Equilibrado';
    }
  };

  // Funções para visualizar conteúdos guardados
  const handleViewSavedContent = async (type: 'affirmations' | 'verses' | 'reflections') => {
    if (!userId) {
      // Fallback para localStorage se não houver userId
      if (type === 'affirmations') {
        const data = JSON.parse(localStorage.getItem('soulrise_saved_affirmations') || '[]');
        setSavedAffirmations(data.map((content: string, index: number) => ({
          id: `local-${index}`,
          content,
          created_at: new Date().toISOString()
        })));
      } else if (type === 'verses') {
        const data = JSON.parse(localStorage.getItem('soulrise_saved_verses') || '[]');
        setSavedVerses(data.map((item: any, index: number) => ({
          id: `local-${index}`,
          content: item.verse || item.content,
          reference: item.reference,
          created_at: new Date().toISOString()
        })));
      } else if (type === 'reflections') {
        const data = JSON.parse(localStorage.getItem('soulrise_saved_reflections') || '[]');
        setSavedReflections(data.map((content: string, index: number) => ({
          id: `local-${index}`,
          content,
          created_at: new Date().toISOString()
        })));
      }
      setShowSavedContent(type);
      return;
    }

    setShowSavedContent(type);

    try {
      if (type === 'affirmations') {
        const data = await getSavedAffirmations(userId);
        setSavedAffirmations(data);
      } else if (type === 'verses') {
        const data = await getSavedVerses(userId);
        setSavedVerses(data);
      } else if (type === 'reflections') {
        const data = await getSavedReflections(userId);
        setSavedReflections(data);
      }
    } catch {
      // Fallback para localStorage em caso de erro (silencioso)
      if (type === 'affirmations') {
        const data = JSON.parse(localStorage.getItem('soulrise_saved_affirmations') || '[]');
        setSavedAffirmations(data.map((content: string, index: number) => ({
          id: `local-${index}`,
          content,
          created_at: new Date().toISOString()
        })));
      } else if (type === 'verses') {
        const data = JSON.parse(localStorage.getItem('soulrise_saved_verses') || '[]');
        setSavedVerses(data.map((item: any, index: number) => ({
          id: `local-${index}`,
          content: item.verse || item.content,
          reference: item.reference,
          created_at: new Date().toISOString()
        })));
      } else if (type === 'reflections') {
        const data = JSON.parse(localStorage.getItem('soulrise_saved_reflections') || '[]');
        setSavedReflections(data.map((content: string, index: number) => ({
          id: `local-${index}`,
          content,
          created_at: new Date().toISOString()
        })));
      }
    }
  };

  const handleDeleteContent = async (type: 'affirmations' | 'verses' | 'reflections', id: string) => {
    if (!userId || id.startsWith('local-')) {
      // Deletar do localStorage
      if (type === 'affirmations') {
        const data = JSON.parse(localStorage.getItem('soulrise_saved_affirmations') || '[]');
        const index = parseInt(id.replace('local-', ''));
        data.splice(index, 1);
        localStorage.setItem('soulrise_saved_affirmations', JSON.stringify(data));
        setSavedAffirmations(prev => prev.filter(item => item.id !== id));
        setProfile(prev => ({ ...prev, savedAffirmations: prev.savedAffirmations - 1 }));
      } else if (type === 'verses') {
        const data = JSON.parse(localStorage.getItem('soulrise_saved_verses') || '[]');
        const index = parseInt(id.replace('local-', ''));
        data.splice(index, 1);
        localStorage.setItem('soulrise_saved_verses', JSON.stringify(data));
        setSavedVerses(prev => prev.filter(item => item.id !== id));
        setProfile(prev => ({ ...prev, savedVerses: prev.savedVerses - 1 }));
      } else if (type === 'reflections') {
        const data = JSON.parse(localStorage.getItem('soulrise_saved_reflections') || '[]');
        const index = parseInt(id.replace('local-', ''));
        data.splice(index, 1);
        localStorage.setItem('soulrise_saved_reflections', JSON.stringify(data));
        setSavedReflections(prev => prev.filter(item => item.id !== id));
        setProfile(prev => ({ ...prev, savedReflections: prev.savedReflections - 1 }));
      }
      return;
    }

    let success = false;

    try {
      if (type === 'affirmations') {
        success = await deleteAffirmation(userId, id);
        if (success) {
          setSavedAffirmations(prev => prev.filter(item => item.id !== id));
          setProfile(prev => ({ ...prev, savedAffirmations: prev.savedAffirmations - 1 }));
        }
      } else if (type === 'verses') {
        success = await deleteVerse(userId, id);
        if (success) {
          setSavedVerses(prev => prev.filter(item => item.id !== id));
          setProfile(prev => ({ ...prev, savedVerses: prev.savedVerses - 1 }));
        }
      } else if (type === 'reflections') {
        success = await deleteReflection(userId, id);
        if (success) {
          setSavedReflections(prev => prev.filter(item => item.id !== id));
          setProfile(prev => ({ ...prev, savedReflections: prev.savedReflections - 1 }));
        }
      }
    } catch {
      // Silenciosamente falhar se houver erro
    }
  };

  // Funções do calendário
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const isActiveDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return profile.activeDates.includes(dateStr);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];
    const monthName = currentMonth.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });

    // Dias vazios antes do primeiro dia do mês
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const active = isActiveDay(date);
      const today = isToday(date);

      days.push(
        <div
          key={day}
          className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-all ${
            active
              ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-sm'
              : today
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-md p-4 mt-3">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={previousMonth}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <h3 className="text-sm font-bold text-gray-800 capitalize">{monthName}</h3>
          <button
            onClick={nextMonth}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
            <div key={i} className="text-center text-xs font-semibold text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Dias do mês */}
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>

        {/* Legenda */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-green-400 to-emerald-500"></div>
            <span className="text-gray-600">Ativo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></div>
            <span className="text-gray-600">Hoje</span>
          </div>
        </div>
      </div>
    );
  };

  // Funções para editar perfil
  const handleEditName = () => {
    setEditedName(profile.name);
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) return;

    // Atualizar no Supabase se configurado (silenciosamente)
    if (userId && isSupabaseConfigured) {
      try {
        await supabase
          .from('profiles')
          .update({ full_name: editedName.trim() })
          .eq('id', userId);
      } catch {
        // Silenciosamente falhar e continuar com localStorage
      }
    }

    // Atualizar no localStorage
    localStorage.setItem('soulrise_user_name', editedName.trim());
    
    // Atualizar estado
    setProfile(prev => ({ ...prev, name: editedName.trim() }));
    setIsEditingName(false);
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditedName('');
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida.');
      return;
    }

    // Validar tamanho (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 2MB.');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      if (userId && isSupabaseConfigured) {
        // Upload para Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(filePath, file);

        if (uploadError) {
          // Fallback para base64 (silencioso)
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            setProfile(prev => ({ ...prev, avatarUrl: base64String }));
            localStorage.setItem('soulrise_avatar_url', base64String);
          };
          reader.readAsDataURL(file);
          return;
        }

        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('profile-images')
          .getPublicUrl(filePath);

        // Atualizar perfil no Supabase (silenciosamente)
        try {
          await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', userId);
        } catch {
          // Continuar mesmo se falhar
        }

        // Atualizar estado
        setProfile(prev => ({ ...prev, avatarUrl: publicUrl }));
        localStorage.setItem('soulrise_avatar_url', publicUrl);
      } else {
        // Fallback: converter para base64 e salvar no localStorage
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setProfile(prev => ({ ...prev, avatarUrl: base64String }));
          localStorage.setItem('soulrise_avatar_url', base64String);
        };
        reader.readAsDataURL(file);
      }
    } catch {
      alert('Erro ao processar imagem. Tente novamente.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">A carregar perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Voltar</span>
          </Link>
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-auto" />
            <span className="font-bold text-xl text-gray-800">Perfil</span>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
        
        {/* 1. Resumo do Utilizador */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Avatar com opção de upload */}
              <div className="relative group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                  {profile.avatarUrl ? (
                    <img 
                      src={profile.avatarUrl} 
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                
                {/* Botão de upload */}
                <label 
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {isUploadingAvatar ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={isUploadingAvatar}
                />
              </div>

              <div>
                {/* Nome editável */}
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-2xl font-bold text-gray-800 border-b-2 border-purple-500 focus:outline-none bg-transparent"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1 hover:bg-green-100 rounded transition-colors"
                    >
                      <Save className="w-5 h-5 text-green-600" />
                    </button>
                    <button
                      onClick={handleCancelEditName}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
                    <button
                      onClick={handleEditName}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                )}
                
                <div className="flex items-center gap-2 mt-1">
                  {profile.isPremium ? (
                    <span className="flex items-center gap-1 text-sm font-medium text-amber-600">
                      <Crown className="w-4 h-4" />
                      Premium
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">Plano Free</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-700">
              <Target className="w-5 h-5 text-purple-500" />
              <span className="font-medium">Objetivos:</span>
            </div>
            {profile.goals.length > 0 ? (
              <div className="flex flex-wrap gap-2 ml-7">
                {profile.goals.map((goal, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 ml-7">Nenhum objetivo definido ainda</p>
            )}
          </div>
        </div>

        {/* Card Premium/Upgrade - ÚNICA OCORRÊNCIA APÓS O UTILIZADOR */}
        {!profile.isPremium ? (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 mb-6 border-2 border-amber-300">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <Crown className="w-6 h-6 text-amber-600" />
                  <h3 className="text-xl font-bold text-amber-900">Fazer Upgrade para Premium</h3>
                </div>
                <p className="text-sm text-amber-700">
                  Desbloqueie conteúdos exclusivos, funcionalidades avançadas e muito mais
                </p>
              </div>
              <button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl whitespace-nowrap">
                Saber Mais
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 mb-6 border-2 border-amber-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-900">Plano Premium Ativo</h3>
                  <p className="text-sm text-amber-700">Aproveite todos os benefícios exclusivos</p>
                </div>
              </div>
              <button className="px-6 py-2 bg-white text-amber-700 font-semibold rounded-lg hover:bg-amber-50 transition-all border border-amber-300">
                Gerir Subscrição
              </button>
            </div>
          </div>
        )}

        {/* 2. Streak */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-6 mb-6 border-2 border-orange-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            Consistência
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Streak Atual</span>
                  <p className="text-3xl font-bold text-orange-600">{profile.streakCount}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {profile.streakCount === 0 && 'Começa hoje a tua jornada!'}
                {profile.streakCount === 1 && 'Primeiro dia! Continua amanhã.'}
                {profile.streakCount > 1 && `${profile.streakCount} dias seguidos. Continua!`}
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Melhor Streak</span>
                  <p className="text-3xl font-bold text-amber-600">{profile.bestStreak}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {profile.bestStreak === 0 && 'Ainda não tens recorde.'}
                {profile.bestStreak > 0 && `O teu recorde pessoal!`}
              </p>
            </div>
          </div>

          {/* Mensagem motivacional baseada no streak */}
          {profile.streakCount >= 3 && (
            <div className="mt-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4">
              <p className="text-center text-orange-800 font-medium">
                {profile.streakCount === 3 && '✨ 3 dias seguidos. Estás a criar consistência.'}
                {profile.streakCount === 7 && '🔥 7 dias. Uma semana contigo mesmo. Continua.'}
                {profile.streakCount === 14 && '🌿 14 dias. O teu ritmo está a ficar forte.'}
                {profile.streakCount === 30 && '🏆 30 dias. Isto já é transformação real.'}
                {profile.streakCount > 3 && profile.streakCount !== 7 && profile.streakCount !== 14 && profile.streakCount !== 30 && 
                  `🔥 ${profile.streakCount} dias consecutivos! Incrível!`}
              </p>
            </div>
          )}
        </div>

        {/* 3. Progresso com Calendário */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            Progresso
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 hover:from-blue-100 hover:to-blue-200 transition-all text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Dias Ativos</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-blue-600 transition-transform ${showCalendar ? 'rotate-180' : ''}`} />
              </div>
              <p className="text-3xl font-bold text-blue-900">{profile.activeDays}</p>
            </button>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Ritual Hoje</span>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {profile.ritualCompletedToday ? 'Concluído ✓' : 'Pendente'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Consistência</span>
              </div>
              <p className="text-sm font-semibold text-purple-900">{profile.consistency}</p>
            </div>
          </div>

          {/* Calendário de Dias Ativos (colapsável) */}
          {showCalendar && renderCalendar()}
        </div>

        {/* 4. Conteúdos Guardados */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500" />
            Conteúdos Guardados
          </h3>
          
          <div className="space-y-3">
            <button
              onClick={() => handleViewSavedContent('affirmations')}
              className="w-full flex items-center justify-between p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-pink-600" />
                <span className="font-medium text-gray-800">Afirmações</span>
              </div>
              <span className="text-2xl font-bold text-pink-600">{profile.savedAffirmations}</span>
            </button>

            <button
              onClick={() => handleViewSavedContent('verses')}
              className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-800">Versículos</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{profile.savedVerses}</span>
            </button>

            <button
              onClick={() => handleViewSavedContent('reflections')}
              className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-800">Reflexões</span>
              </div>
              <span className="text-2xl font-bold text-purple-600">{profile.savedReflections}</span>
            </button>
          </div>
        </div>

        {/* 5. Suporte */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-500" />
            Suporte
          </h3>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
            <p className="text-gray-700 text-sm mb-4">
              Tens alguma dúvida ou problema? Contacta-nos.
            </p>
            
            <a
              href="mailto:soulrisesuporte@gmail.com"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              <Mail className="w-5 h-5" />
              Contactar Suporte
            </a>
            
            <p className="text-center text-xs text-gray-600 mt-3">
              soulrisesuporte@gmail.com
            </p>
          </div>
        </div>

        {/* 6. Configurações */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="w-6 h-6 text-gray-600" />
            Configurações
          </h3>
          
          <div className="space-y-4">
            {/* Notificações */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                {profile.notificationsEnabled ? (
                  <Bell className="w-5 h-5 text-blue-600" />
                ) : (
                  <BellOff className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <span className="font-medium text-gray-800 block">Notificações</span>
                  <span className="text-xs text-gray-600">Lembretes e marcos de streak</span>
                </div>
              </div>
              <button
                onClick={toggleNotifications}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  profile.notificationsEnabled ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    profile.notificationsEnabled ? 'translate-x-7' : ''
                  }`}
                />
              </button>
            </div>

            {/* Preferência de Foco */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-800">Preferência de Foco</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {(['balanced', 'personal', 'spiritual'] as const).map((pref) => (
                  <button
                    key={pref}
                    onClick={() => updateFocusPreference(pref)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      profile.focusPreference === pref
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {getFocusLabel(pref)}
                  </button>
                ))}
              </div>
            </div>

            {/* Atualizar Objetivos / Recriar Plano */}
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                  <div>
                    <span className="font-medium text-gray-800 block">Recriar plano</span>
                    <span className="text-xs text-gray-600">Refazer questionário e criar novo plano personalizado</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowRecreatePlanConfirm(true)}
                  className="px-4 py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-all border border-purple-200 whitespace-nowrap ml-4"
                >
                  Recriar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Mensagem Final */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-center">
          <p className="text-white text-lg font-medium italic">
            "Cada passo conta. Continua."
          </p>
        </div>
      </div>

      {/* Modal de Confirmação para Recriar Plano */}
      {showRecreatePlanConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Recriar Plano Personalizado?
              </h3>
              <p className="text-gray-600 text-sm">
                Ao recriar o plano, irás refazer o questionário e os teus objetivos atuais serão substituídos. Esta ação não pode ser desfeita.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowRecreatePlanConfirm(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRecreatePlan}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Visualizar Conteúdos Guardados */}
      {showSavedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {showSavedContent === 'affirmations' && 'Afirmações Guardadas'}
                {showSavedContent === 'verses' && 'Versículos Guardados'}
                {showSavedContent === 'reflections' && 'Reflexões Guardadas'}
              </h3>
              <button
                onClick={() => setShowSavedContent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {showSavedContent === 'affirmations' && savedAffirmations.length === 0 && (
                <p className="text-center text-gray-500 py-8">Nenhuma afirmação guardada ainda</p>
              )}
              {showSavedContent === 'affirmations' && savedAffirmations.map((item) => (
                <div key={item.id} className="bg-pink-50 rounded-xl p-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{item.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(item.created_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteContent('affirmations', item.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}

              {showSavedContent === 'verses' && savedVerses.length === 0 && (
                <p className="text-center text-gray-500 py-8">Nenhum versículo guardado ainda</p>
              )}
              {showSavedContent === 'verses' && savedVerses.map((item) => (
                <div key={item.id} className="bg-blue-50 rounded-xl p-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{item.content}</p>
                    {item.reference && (
                      <p className="text-sm text-blue-600 font-semibold mt-1">{item.reference}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(item.created_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteContent('verses', item.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}

              {showSavedContent === 'reflections' && savedReflections.length === 0 && (
                <p className="text-center text-gray-500 py-8">Nenhuma reflexão guardada ainda</p>
              )}
              {showSavedContent === 'reflections' && savedReflections.map((item) => (
                <div key={item.id} className="bg-purple-50 rounded-xl p-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{item.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(item.created_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteContent('reflections', item.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
