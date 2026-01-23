'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Trophy, 
  Calendar,
  Bookmark,
  Lock,
  ChevronRight,
  Sparkles,
  RotateCcw,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStreakData } from '@/lib/streak-system';

const CHECKOUT_URL = 'https://pay.kambafy.com/checkout/a8abc16a-4344-4e32-b456-4f69592454ac';

export default function PerfilView() {
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [diasAtivos, setDiasAtivos] = useState(0);
  const isPremium = false;

  useEffect(() => {
    // Carregar dados do streak do sistema centralizado
    loadStreakData();
    
    // Carregar dias ativos do localStorage
    const storedDiasAtivos = localStorage.getItem('soulrise_dias_ativos');
    if (storedDiasAtivos) setDiasAtivos(parseInt(storedDiasAtivos));

    // Escutar evento de atualização de streak do HomeView
    const handleStreakUpdate = () => {
      loadStreakData();
    };
    window.addEventListener('soulrise_streak_updated', handleStreakUpdate);

    // Atualizar dados a cada 2 segundos para sincronização em tempo real
    const interval = setInterval(() => {
      loadStreakData();
    }, 2000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('soulrise_streak_updated', handleStreakUpdate);
    };
  }, []);

  const loadStreakData = async () => {
    const streakData = await getStreakData();
    setStreak(streakData.streakCount);
    setBestStreak(streakData.bestStreak);
  };

  const handleRecriarPlano = () => {
    // Apagar quiz_done do localStorage
    localStorage.removeItem('quiz_done');
    // Redirecionar para o quiz
    window.location.href = '/'; // Isso vai acionar a lógica de redirecionamento no componente principal
  };

  const handlePremiumClick = () => {
    window.open(CHECKOUT_URL, '_blank');
  };

  // Mensagens motivacionais baseadas no streak
  const getStreakMessage = (streakCount: number): string => {
    if (streakCount === 0) return '🌱 Começa hoje a tua jornada de transformação!';
    if (streakCount === 1) return '✨ Primeiro dia! Cada jornada começa com um passo.';
    if (streakCount < 3) return '🔥 Continua assim! A consistência está a começar.';
    if (streakCount < 7) return '💪 Estás a criar um hábito forte!';
    if (streakCount < 14) return '🌟 Uma semana completa! O teu compromisso é inspirador.';
    if (streakCount < 30) return '🏆 Duas semanas! A transformação está a acontecer.';
    if (streakCount < 60) return '👑 Um mês! Isto já é um estilo de vida.';
    return '🔮 Incrível! És um exemplo de consistência e dedicação.';
  };

  // Calcular dias do calendário (últimos 30 dias)
  const getCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Verificar se este dia está no streak
      const streakData = localStorage.getItem('soulrise_streak_data');
      let isActive = false;
      
      if (streakData) {
        const data = JSON.parse(streakData);
        const lastActiveDate = data.lastActiveDate;
        
        if (lastActiveDate) {
          const lastDate = new Date(lastActiveDate);
          const currentDate = new Date(dateString);
          
          // Se é hoje ou está dentro do streak atual
          if (dateString === lastActiveDate) {
            isActive = true;
          } else if (currentDate < lastDate) {
            const daysDiff = Math.floor((lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff < data.streakCount) {
              isActive = true;
            }
          }
        }
      }
      
      days.push({
        date: dateString,
        day: date.getDate(),
        isActive
      });
    }
    
    return days;
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="max-w-4xl mx-auto pb-20 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Perfil 👤
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          O teu progresso e preferências
        </p>
      </div>

      {/* Informações do Utilizador */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Utilizador SoulRise</h2>
            <p className="text-purple-100">Membro desde hoje</p>
          </div>
        </div>

        {!isPremium && (
          <button
            onClick={handlePremiumClick}
            className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Upgrade para Premium</p>
                  <p className="text-sm text-purple-100">Desbloqueia todo o potencial</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        )}
      </div>

      {/* Streak Atual - FREE - SINCRONIZADO */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Streak Atual</h2>
        </div>
        <div className="text-center py-6">
          <p className="text-6xl font-bold text-orange-500 mb-2">{streak}</p>
          <p className="text-gray-600 mb-4">{streak === 1 ? 'dia consecutivo' : 'dias consecutivos'}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200">
          <p className="text-sm text-orange-700 text-center font-medium">
            {getStreakMessage(streak)}
          </p>
        </div>

        {/* Calendário Visual - Últimos 30 dias */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Últimos 30 dias</h3>
          <div className="grid grid-cols-10 gap-2">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                  day.isActive
                    ? 'bg-gradient-to-br from-orange-400 to-red-400 text-white shadow-md'
                    : 'bg-gray-100 text-gray-400'
                }`}
                title={day.date}
              >
                {day.day}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-400 to-red-400"></div>
              <span>Dia ativo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-100"></div>
              <span>Dia inativo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Melhor Streak - FREE - SINCRONIZADO */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Melhor Streak</h2>
        </div>
        <div className="text-center py-6">
          <p className="text-6xl font-bold text-amber-500 mb-2">{bestStreak}</p>
          <p className="text-gray-600">{bestStreak === 1 ? 'dia' : 'dias'} consecutivos</p>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border-2 border-amber-200">
          <p className="text-sm text-amber-700 text-center font-medium">
            {bestStreak === 0 
              ? '🌟 Começa hoje e estabelece o teu recorde!' 
              : bestStreak === streak 
                ? '🔥 Este é o teu melhor streak! Continua a superar-te!' 
                : '💪 Consegues superar este recorde. Continua firme!'}
          </p>
        </div>
      </div>

      {/* Dias Ativos - FREE */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Dias Ativos</h2>
        </div>
        <div className="text-center py-6">
          <p className="text-6xl font-bold text-blue-500 mb-2">{diasAtivos}</p>
          <p className="text-gray-600">dias totais na app</p>
        </div>
      </div>

      {/* Conteúdos Guardados - FREE (básico) */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
            <Bookmark className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Conteúdos Guardados</h2>
        </div>
        <p className="text-gray-600 text-center py-8">
          Ainda não guardaste nenhum conteúdo
        </p>
      </div>

      {/* Recriar Plano - FREE */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 shadow-lg mb-6 border-2 border-amber-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center">
            <RotateCcw className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Recriar Plano</h2>
        </div>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Queres refazer o quiz inicial e criar um novo plano personalizado? Isto vai reiniciar as tuas preferências.
        </p>
        <Button
          onClick={handleRecriarPlano}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 rounded-xl"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Recriar Plano
        </Button>
      </div>

      {/* Histórico Completo - PREMIUM */}
      <button
        onClick={handlePremiumClick}
        className="w-full bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6 border-2 border-gray-200 hover:border-purple-300 transition-all text-left group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Histórico Completo</h2>
          </div>
          <Lock className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
          <p className="text-gray-700 text-base leading-relaxed mb-3">
            Acede ao histórico completo das tuas atividades, gráficos de progresso e insights sobre os teus padrões...
          </p>
          <div className="flex items-center gap-2 text-purple-600 font-semibold">
            <span>Ver histórico completo</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </button>

      {/* Ajuste do Plano - PREMIUM */}
      <button
        onClick={handlePremiumClick}
        className="w-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 md:p-8 shadow-xl text-white text-left group hover:shadow-2xl transition-all"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold">Ajuste do Plano</h2>
          </div>
          <Lock className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </div>
        <p className="text-base leading-relaxed mb-4">
          Personaliza o teu plano diário, ajusta frequência e intensidade, e define as tuas preferências de conteúdo...
        </p>
        <div className="flex items-center gap-2 font-semibold">
          <span>Personalizar plano</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </button>
    </div>
  );
}
