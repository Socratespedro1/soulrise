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
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import PaywallModal from '../PaywallModal';

export default function PerfilView() {
  const [streak, setStreak] = useState(0);
  const [diasAtivos, setDiasAtivos] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState('');
  const [paywallBenefits, setPaywallBenefits] = useState<string[]>([]);
  const isPremium = false;

  useEffect(() => {
    // Carregar dados do localStorage
    const storedStreak = localStorage.getItem('soulrise_streak');
    const storedDiasAtivos = localStorage.getItem('soulrise_dias_ativos');
    
    if (storedStreak) setStreak(parseInt(storedStreak));
    if (storedDiasAtivos) setDiasAtivos(parseInt(storedDiasAtivos));
  }, []);

  const handleRecriarPlano = () => {
    // Apagar quiz_done do localStorage
    localStorage.removeItem('quiz_done');
    // Redirecionar para o quiz
    window.location.href = '/'; // Isso vai acionar a lógica de redirecionamento no componente principal
  };

  const handlePremiumClick = (feature: string, benefits: string[]) => {
    if (!isPremium) {
      setPaywallFeature(feature);
      setPaywallBenefits(benefits);
      setShowPaywall(true);
    }
  };

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
            onClick={() => handlePremiumClick('Premium', [
              'Acesso completo a todo o conteúdo',
              'Histórico detalhado de progresso',
              'Personalização avançada',
              'Sem anúncios'
            ])}
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

      {/* Streak Atual - FREE */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Streak Atual</h2>
        </div>
        <div className="text-center py-6">
          <p className="text-6xl font-bold text-orange-500 mb-2">{streak}</p>
          <p className="text-gray-600">dias consecutivos</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4">
          <p className="text-sm text-orange-700 text-center">
            🔥 Continua assim! Consistência é a chave para transformação.
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
        onClick={() => handlePremiumClick('Histórico Completo', [
          'Histórico detalhado de todas as atividades',
          'Gráficos de progresso ao longo do tempo',
          'Insights sobre os teus padrões'
        ])}
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

      {/* Melhor Streak - PREMIUM */}
      <button
        onClick={() => handlePremiumClick('Melhor Streak', [
          'Acompanha o teu melhor streak de todos os tempos',
          'Estatísticas detalhadas de consistência',
          'Celebra as tuas conquistas'
        ])}
        className="w-full bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6 border-2 border-gray-200 hover:border-purple-300 transition-all text-left group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Melhor Streak</h2>
          </div>
          <Lock className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200">
          <p className="text-gray-700 text-base leading-relaxed mb-3">
            Acompanha o teu melhor streak de todos os tempos e celebra as tuas conquistas...
          </p>
          <div className="flex items-center gap-2 text-purple-600 font-semibold">
            <span>Ver melhor streak</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </button>

      {/* Ajuste do Plano - PREMIUM */}
      <button
        onClick={() => handlePremiumClick('Ajuste do Plano e Preferências', [
          'Personaliza o teu plano diário',
          'Ajusta frequência e intensidade',
          'Define preferências de conteúdo'
        ])}
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

      {/* Paywall Modal */}
      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          feature={paywallFeature}
          benefits={paywallBenefits}
        />
      )}
    </div>
  );
}
