'use client';

import { useState, useEffect } from 'react';
import { Target, Zap, Repeat, Sparkles, MessageSquare, Trophy, X, Check, Heart, Crown, Lock, Flame } from 'lucide-react';
import { Goal, DailyPlan, goalLabels } from '@/lib/soulrise-data';
import { PersonalizedPlan } from '../ConnectionQuiz';
import { checkPremiumStatus, requiresPremium } from '@/lib/premium-helpers';
import PremiumPaywall from '../PremiumPaywall';
import { checkAndUpdateStreak, getStreakData } from '@/lib/streak-system';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface HomeViewProps {
  goals: string[];
  dailyPlan: DailyPlan;
  personalizedPlan?: PersonalizedPlan | null;
}

type ModalType = 'intencao' | 'acaoPrincipal' | 'acaoComplementar' | 'ritual' | 'afirmacao' | 'foco' | 'saude' | null;

interface ModalContent {
  title: string;
  mainText: string;
  explanation: string;
  howToApply: string;
  reflection?: string;
  duration?: string;
  isOptional?: boolean;
  isPremium?: boolean;
  preview?: string;
}

const PREMIUM_URL = 'https://soulrise-premium.lasy.pro';

export default function HomeView({ goals, dailyPlan, personalizedPlan }: HomeViewProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallPreview, setPaywallPreview] = useState<string>('');
  const [isPremium, setIsPremium] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [streakClicked, setStreakClicked] = useState(false);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);

  useEffect(() => {
    const { isPremium: premium } = checkPremiumStatus();
    setIsPremium(premium);
    
    // Carregar streak atual
    loadStreak();
  }, []);

  const loadStreak = async () => {
    const streakData = await getStreakData();
    setStreakCount(streakData.streakCount);
    
    // Verificar se já clicou hoje
    const today = new Date().toISOString().split('T')[0];
    const lastClick = localStorage.getItem('soulrise_streak_last_click');
    if (lastClick === today) {
      setStreakClicked(true);
    }
  };

  const handleStreakClick = async () => {
    if (streakClicked) return;

    // Obter userId
    let userId: string | null = null;
    if (isSupabaseConfigured) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          userId = session.user.id;
        }
      } catch (error) {
        console.log('Erro ao obter sessão:', error);
      }
    }

    // Atualizar streak
    if (userId) {
      const updatedStreak = await checkAndUpdateStreak(userId);
      setStreakCount(updatedStreak.streakCount);
    } else {
      // Fallback: atualizar no localStorage
      const updatedStreak = await checkAndUpdateStreak('offline-user');
      setStreakCount(updatedStreak.streakCount);
    }

    // Marcar como clicado hoje
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('soulrise_streak_last_click', today);
    setStreakClicked(true);

    // Mostrar animação
    setShowStreakAnimation(true);
    setTimeout(() => setShowStreakAnimation(false), 2000);

    // Disparar evento customizado para sincronizar com PerfilView
    window.dispatchEvent(new CustomEvent('soulrise_streak_updated'));
  };

  // Sugestões diárias de Saúde & Bem-Estar (rotativas)
  const saudeSuggestions = [
    {
      title: 'Respiração 4-7-8',
      description: 'Técnica simples para acalmar o sistema nervoso',
      duration: '3-5 minutos',
      category: 'Respiração & Relaxamento'
    },
    {
      title: 'Alongamento Diário',
      description: 'Movimentos suaves para despertar o corpo',
      duration: '5-7 minutos',
      category: 'Corpo & Movimento'
    },
    {
      title: 'Check-in Corporal',
      description: 'Momento de conexão com o corpo',
      duration: '3-5 minutos',
      category: 'Autocuidado Diário'
    },
    {
      title: 'Ritual Noturno',
      description: 'Preparar corpo e mente para um sono reparador',
      duration: '15-20 minutos',
      category: 'Sono & Recuperação'
    },
    {
      title: 'Pausa de Presença',
      description: 'Micro-pausa para voltar ao momento presente',
      duration: '1-2 minutos',
      category: 'Respiração & Relaxamento'
    },
    {
      title: 'Movimento Consciente',
      description: 'Pequena prática de movimento com atenção plena',
      duration: '5-10 minutos',
      category: 'Corpo & Movimento'
    }
  ];

  // Selecionar sugestão do dia (baseado no dia do ano)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const dailySaudeSuggestion = saudeSuggestions[dayOfYear % saudeSuggestions.length];

  // Definir quais itens são Premium
  const premiumItems = ['acaoComplementar', 'foco'];

  // Se temos plano personalizado da OpenAI, usamos ele
  const planItems = personalizedPlan ? [
    { 
      id: 'intencao',
      icon: Target, 
      label: 'Intenção do Dia', 
      value: personalizedPlan.dailyIntention, 
      color: 'from-purple-400 to-indigo-400',
      modalType: 'intencao' as ModalType,
      isPremium: false
    },
    { 
      id: 'acaoPrincipal',
      icon: Zap, 
      label: 'Ação Principal', 
      value: personalizedPlan.mainAction, 
      color: 'from-blue-400 to-cyan-400',
      modalType: 'acaoPrincipal' as ModalType,
      isPremium: false
    },
    { 
      id: 'ritual',
      icon: Sparkles, 
      label: 'Ritual Simples', 
      value: personalizedPlan.ritual, 
      color: 'from-orange-400 to-amber-400',
      modalType: 'ritual' as ModalType,
      isPremium: false
    },
    { 
      id: 'afirmacao',
      icon: MessageSquare, 
      label: 'Afirmação do Dia', 
      value: personalizedPlan.affirmation, 
      color: 'from-green-400 to-emerald-400',
      modalType: 'afirmacao' as ModalType,
      isPremium: false
    },
    { 
      id: 'acaoComplementar',
      icon: Repeat, 
      label: 'Ação Complementar', 
      value: personalizedPlan.complementaryAction, 
      color: 'from-pink-400 to-rose-400',
      modalType: 'acaoComplementar' as ModalType,
      isPremium: true
    },
    { 
      id: 'foco',
      icon: Trophy, 
      label: 'Mini-Desafio Diário', 
      value: personalizedPlan.weeklyFocus, 
      color: 'from-violet-400 to-purple-400',
      modalType: 'foco' as ModalType,
      isPremium: true
    }
  ] : [
    { id: 'intencao', icon: Target, label: 'Intenção do Dia', value: dailyPlan.intencao, color: 'from-blue-400 to-cyan-400', modalType: 'intencao' as ModalType, isPremium: false },
    { id: 'acaoPrincipal', icon: Zap, label: 'Ação Diária', value: dailyPlan.acaoDiaria, color: 'from-purple-400 to-indigo-400', modalType: 'acaoPrincipal' as ModalType, isPremium: false },
    { id: 'ritual', icon: Sparkles, label: 'Ritual', value: dailyPlan.ritual, color: 'from-orange-400 to-amber-400', modalType: 'ritual' as ModalType, isPremium: false },
    { id: 'afirmacao', icon: MessageSquare, label: 'Afirmação', value: dailyPlan.afirmacao, color: 'from-green-400 to-emerald-400', modalType: 'afirmacao' as ModalType, isPremium: false },
    { id: 'acaoComplementar', icon: Repeat, label: 'Ação Complementar', value: dailyPlan.acaoComplementar, color: 'from-pink-400 to-rose-400', modalType: 'acaoComplementar' as ModalType, isPremium: true },
    { id: 'foco', icon: Trophy, label: 'Mini-Desafio', value: dailyPlan.miniDesafio, color: 'from-violet-400 to-purple-400', modalType: 'foco' as ModalType, isPremium: true }
  ];

  // Validação segura dos objetivos
  const primaryGoal = (goals && goals.length > 0 ? goals[0] : 'equilibrio') as Goal;
  const secondaryGoal = (goals && goals.length > 1 ? goals[1] : undefined) as Goal | undefined;

  const getModalContent = (type: ModalType): ModalContent | null => {
    const item = planItems.find(p => p.modalType === type);
    
    if (type === 'saude') {
      return {
        title: dailySaudeSuggestion.title,
        mainText: dailySaudeSuggestion.description,
        explanation: `Esta é uma prática da área de ${dailySaudeSuggestion.category}. Integrar cuidados simples de saúde e bem-estar no seu dia fortalece o equilíbrio entre mente, espírito e corpo.`,
        howToApply: 'Dedique alguns minutos do seu dia para esta prática. Pode ser pela manhã, durante uma pausa ou à noite. O importante é fazer com presença e sem pressão.',
        reflection: 'Cuidar do corpo é cuidar de si. Cada pequeno gesto conta.',
        duration: dailySaudeSuggestion.duration,
        isPremium: false
      };
    }

    if (!item) return null;

    const isPremiumContent = item.isPremium && !isPremium;

    switch (type) {
      case 'intencao':
        return {
          title: 'Intenção do Dia',
          mainText: item.value,
          explanation: 'A intenção do dia é o seu norte emocional e mental. É aquilo que você escolhe cultivar internamente ao longo das próximas horas.',
          howToApply: 'Ao acordar, respire fundo e repita mentalmente esta intenção. Sempre que sentir dispersão, volte a ela. Use-a como filtro para decisões e atitudes.',
          reflection: 'Como posso incorporar esta intenção em cada momento do meu dia?',
          isPremium: false
        };
      case 'acaoPrincipal':
        return {
          title: 'Ação Principal',
          mainText: item.value,
          explanation: 'Esta é a ação mais importante do seu dia. Ela está alinhada com o seu objetivo principal e tem impacto direto no seu crescimento.',
          howToApply: 'Reserve um momento específico do dia para realizar esta ação. Trate-a como prioridade máxima. Não deixe para depois.',
          reflection: 'Esta ação aproxima-me do meu objetivo principal e fortalece a minha jornada de transformação.',
          isPremium: false
        };
      case 'acaoComplementar':
        return {
          title: 'Ação Complementar',
          mainText: item.value,
          explanation: 'Esta ação complementa o seu desenvolvimento. Ela reforça hábitos saudáveis e amplia o impacto da ação principal.',
          howToApply: 'Realize esta ação quando tiver um momento tranquilo. Pode ser pela manhã, à tarde ou à noite. O importante é fazê-la com presença.',
          reflection: 'Esta ação é opcional, mas fortalece ainda mais o meu progresso.',
          isOptional: true,
          isPremium: true,
          preview: item.value.substring(0, 80) + '...'
        };
      case 'ritual':
        return {
          title: 'Ritual Simples',
          mainText: item.value,
          explanation: 'Um ritual é um momento sagrado que você dedica a si mesmo. É uma pausa consciente para se reconectar com o seu interior.',
          howToApply: 'Escolha um momento tranquilo. Pode ser ao acordar, antes de dormir ou em uma pausa do dia. Siga o ritual com calma e presença.',
          reflection: 'Respire fundo. Permita-se estar presente. Este momento é seu.',
          duration: '5-10 minutos',
          isPremium: false
        };
      case 'afirmacao':
        return {
          title: 'Afirmação do Dia',
          mainText: item.value,
          explanation: 'As afirmações reprogramam a sua mente para pensamentos positivos e construtivos. Elas fortalecem a sua autoconfiança e clareza.',
          howToApply: 'Repita esta afirmação em voz alta ou mentalmente, várias vezes ao dia. Sinta o significado de cada palavra. Acredite nela.',
          reflection: 'Repita com consciência: deixe que estas palavras se tornem parte de você.',
          isPremium: false
        };
      case 'foco':
        return {
          title: 'Mini-Desafio Diário',
          mainText: item.value,
          explanation: 'O mini-desafio diário é uma prática focada que te ajuda a sair da zona de conforto e crescer de forma consistente.',
          howToApply: 'Dedica tempo específico para este desafio. Trata-o como um compromisso contigo mesmo. Celebra quando completares.',
          reflection: 'Cada desafio que aceito fortalece a minha disciplina e autoconfiança.',
          isPremium: true,
          preview: item.value.substring(0, 80) + '...'
        };
      default:
        return null;
    }
  };

  const handleCardClick = (item: typeof planItems[0]) => {
    // Se é Premium e utilizador não tem Premium, redirecionar DIRETAMENTE para página de vendas
    if (item.isPremium && !isPremium) {
      window.open(PREMIUM_URL, '_blank');
      return;
    }

    // Caso contrário, abrir modal normal
    setActiveModal(item.modalType);
  };

  const handleMarkAsDone = (itemId: string) => {
    setCompletedItems(prev => {
      const newSet = new Set(prev);
      newSet.add(itemId);
      return newSet;
    });
    setActiveModal(null);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const modalContent = activeModal ? getModalContent(activeModal) : null;

  return (
    <div className="max-w-4xl mx-auto pb-20 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Bem-vindo de volta! ✨
        </h1>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-lg">Objetivo principal:</span>
            <span className="font-semibold text-purple-600 text-lg">{goalLabels[primaryGoal]}</span>
            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              Prioridade
            </span>
          </div>
          {secondaryGoal && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Objetivo secundário:</span>
              <span className="font-medium text-pink-600">{goalLabels[secondaryGoal]}</span>
            </div>
          )}
        </div>
        
        {/* Badge indicando plano personalizado */}
        {personalizedPlan && (
          <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">
              Plano personalizado pela IA
            </span>
          </div>
        )}
      </div>

      {/* Botão de Streak - Gamificação */}
      <div className="mb-6">
        <button
          onClick={handleStreakClick}
          disabled={streakClicked}
          className={`w-full bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 shadow-lg transition-all duration-300 border-2 border-orange-200 text-left relative overflow-hidden ${
            streakClicked 
              ? 'opacity-75 cursor-not-allowed' 
              : 'hover:shadow-xl hover:scale-[1.02] cursor-pointer'
          }`}
        >
          {/* Animação de confetti quando clica */}
          {showStreakAnimation && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-400/20 to-red-400/20 animate-pulse">
              <span className="text-6xl animate-bounce">🔥</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center shadow-md ${
                !streakClicked && 'animate-pulse'
              }`}>
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">
                  {streakClicked ? 'Streak Registado Hoje! 🎉' : 'Clica para Registar o Teu Dia'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {streakClicked 
                    ? `Mantiveste o teu streak de ${streakCount} ${streakCount === 1 ? 'dia' : 'dias'}!` 
                    : 'Mantém a tua consistência diária'}
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600">{streakCount}</div>
              <p className="text-xs text-gray-600 font-medium">{streakCount === 1 ? 'dia' : 'dias'}</p>
            </div>
          </div>

          {!streakClicked && (
            <div className="mt-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-3">
              <p className="text-center text-orange-800 text-sm font-medium">
                👆 Clica aqui todos os dias para manter o teu streak ativo
              </p>
            </div>
          )}

          {streakClicked && (
            <div className="mt-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-3">
              <p className="text-center text-green-800 text-sm font-medium">
                ✅ Já registaste hoje. Volta amanhã para continuar!
              </p>
            </div>
          )}
        </button>
      </div>

      {/* Sugestão de Saúde & Bem-Estar - FREE */}
      <div className="mb-6">
        <button
          onClick={() => setActiveModal('saude')}
          className={`w-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 border-green-200 text-left relative ${
            completedItems.has('saude') ? 'opacity-75' : ''
          }`}
        >
          {completedItems.has('saude') && (
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
          )}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center shadow-md flex-shrink-0">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-800 text-lg">
                  Sugestão de Saúde & Bem-Estar
                </h3>
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Free
                </span>
              </div>
              <p className="text-sm text-green-700 mb-2 font-medium">
                {dailySaudeSuggestion.category}
              </p>
              <p className="text-gray-700 font-medium mb-1">
                {dailySaudeSuggestion.title}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                {dailySaudeSuggestion.description}
              </p>
              <p className="text-xs text-gray-500">
                ⏱️ {dailySaudeSuggestion.duration}
              </p>
              <p className="text-green-600 text-sm mt-3 font-medium">
                Clique para ver detalhes →
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Daily Plan Cards - Com distinção Free/Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {planItems.map((item, index) => {
          const Icon = item.icon;
          const isCompleted = completedItems.has(item.id);
          const isPremiumLocked = item.isPremium && !isPremium;
          
          return (
            <button
              key={index}
              onClick={() => handleCardClick(item)}
              className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 text-left relative ${
                isCompleted ? 'opacity-75' : ''
              } ${isPremiumLocked ? 'border-2 border-amber-300 cursor-pointer' : ''}`}
            >
              {/* Badge Premium - CLICÁVEL */}
              {isPremiumLocked && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all">
                  <Crown className="w-3 h-3" />
                  Premium
                </div>
              )}
              
              {/* Check de conclusão */}
              {isCompleted && !isPremiumLocked && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md flex-shrink-0 relative`}>
                  <Icon className="w-6 h-6 text-white" />
                  {isPremiumLocked && (
                    <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">
                    {item.label}
                  </h3>
                  <p className={`text-gray-600 leading-relaxed text-sm md:text-base ${isPremiumLocked ? 'line-clamp-2 blur-sm' : 'line-clamp-2'}`}>
                    {item.value}
                  </p>
                  <p className={`text-xs mt-2 font-medium ${isPremiumLocked ? 'text-amber-600' : 'text-purple-600'}`}>
                    {isPremiumLocked ? '🔓 Clique para Desbloquear Premium →' : 'Clique para ver detalhes →'}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal de Detalhes - Apenas para conteúdo Free ou Premium desbloqueado */}
      {activeModal && modalContent && !modalContent.isPremium && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Header do Modal */}
            <div className={`sticky top-0 ${activeModal === 'saude' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'} text-white p-6 rounded-t-3xl`}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{modalContent.title}</h2>
                <button
                  onClick={handleCloseModal}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-6">
              {/* Texto Principal */}
              <div className={`bg-gradient-to-br ${activeModal === 'saude' ? 'from-green-50 to-emerald-50' : 'from-purple-50 to-pink-50'} rounded-2xl p-6`}>
                <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-medium">
                  "{modalContent.mainText}"
                </p>
              </div>

              {/* Explicação */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  O que significa
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {modalContent.explanation}
                </p>
              </div>

              {/* Como Aplicar */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Como aplicar
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {modalContent.howToApply}
                </p>
              </div>

              {/* Duração (se aplicável) */}
              {modalContent.duration && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Duração estimada:</span> {modalContent.duration}
                  </p>
                </div>
              )}

              {/* Opcional (se aplicável) */}
              {modalContent.isOptional && (
                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-sm text-amber-800">
                    <span className="font-semibold">Nota:</span> Esta ação é opcional, mas recomendada para potencializar seus resultados.
                  </p>
                </div>
              )}

              {/* Reflexão */}
              {modalContent.reflection && (
                <div className={`bg-gradient-to-r ${activeModal === 'saude' ? 'from-green-100 to-emerald-100' : 'from-purple-100 to-pink-100'} rounded-2xl p-6`}>
                  <p className="text-gray-700 leading-relaxed italic text-center">
                    {modalContent.reflection}
                  </p>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={() => handleMarkAsDone(activeModal === 'saude' ? 'saude' : planItems.find(p => p.modalType === activeModal)?.id || '')}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Marcar como feito
                </button>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200"
                >
                  Fechar momento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paywall Premium - REMOVIDO (redireciona direto agora) */}

      {/* Motivational Quote */}
      <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6" />
          <h3 className="font-semibold text-lg">Pensamento do Dia</h3>
        </div>
        <p className="text-lg md:text-xl leading-relaxed italic">
          {personalizedPlan 
            ? `"${personalizedPlan.affirmation}"`
            : '"A jornada de mil quilómetros começa com um único passo. Hoje, dá esse passo."'
          }
        </p>
      </div>
    </div>
  );
}
