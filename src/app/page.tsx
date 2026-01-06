'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured, offlineAuth } from '@/lib/supabase';
import { checkIsAdmin } from '@/lib/admin';
import { getOrCreateProfile, checkUserHasPlan, updateProfileAfterQuiz } from '@/lib/profile-helpers';
import { checkAndUpdateStreak, scheduleDailyReminder, requestNotificationPermission } from '@/lib/streak-system';
import { checkQuizCompleted, markQuizAsCompleted, resetQuizStatus } from '@/lib/onboarding-helpers';
import AuthForm from '@/components/auth/AuthForm';
import Onboarding from '@/components/soulrise/Onboarding';
import ConnectionQuiz, { QuizAnswers, PersonalizedPlan } from '@/components/soulrise/ConnectionQuiz';
import Questionnaire from '@/components/soulrise/Questionnaire';
import Dashboard from '@/components/soulrise/Dashboard';
import { Goal, generateDailyPlan, DailyPlan } from '@/lib/soulrise-data';

type AppState = 'onboarding' | 'auth' | 'quiz' | 'questionnaire' | 'dashboard';

export default function Home() {
  const router = useRouter();
  const [appState, setAppState] = useState<AppState>('onboarding');
  const [userGoals, setUserGoals] = useState<string[]>([]);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [personalizedPlan, setPersonalizedPlan] = useState<PersonalizedPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Inicializar sistema de streak quando utilizador faz login
  const initializeStreak = async (uid: string) => {
    try {
      // Atualizar streak
      await checkAndUpdateStreak(uid);
      
      // Solicitar permissão para notificações
      await requestNotificationPermission();
      
      // Agendar lembretes diários
      scheduleDailyReminder();
    } catch (error) {
      console.log('Erro ao inicializar streak:', error);
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        let isLoggedIn = false;
        let currentUserId: string | null = null;
        let userEmail = '';

        if (isSupabaseConfigured) {
          // Tentar verificar sessão do Supabase
          try {
            const { data: { session } } = await supabase.auth.getSession();
            isLoggedIn = !!session;
            if (session?.user) {
              currentUserId = session.user.id;
              userEmail = session.user.email || '';
              setUserId(currentUserId);
              
              // Inicializar sistema de streak
              await initializeStreak(currentUserId);
            }
          } catch (error) {
            console.error('Erro ao verificar sessão Supabase:', error);
            // Se falhar, verificar modo offline
            const offlineSession = offlineAuth.getSession();
            isLoggedIn = !!offlineSession.user;
            if (offlineSession.user) {
              currentUserId = offlineSession.user.id;
              userEmail = offlineSession.user.email;
              
              // Inicializar streak no modo offline
              await initializeStreak(currentUserId);
            }
          }
        } else {
          // Modo offline - verificar sessão local
          const offlineSession = offlineAuth.getSession();
          isLoggedIn = !!offlineSession.user;
          if (offlineSession.user) {
            currentUserId = offlineSession.user.id;
            userEmail = offlineSession.user.email;
            
            // Inicializar streak no modo offline
            await initializeStreak(currentUserId);
          }
        }

        if (isLoggedIn && currentUserId) {
          // User is logged in - verificar se é admin
          const isAdmin = await checkIsAdmin();
          
          if (isAdmin) {
            // É admin - redirecionar para painel de administração
            router.push('/admin');
            return;
          }

          // NOVA LÓGICA: Verificar quiz_completed no Supabase
          const quizCompleted = await checkQuizCompleted(currentUserId);

          if (quizCompleted) {
            // REGRA: quiz_completed = true -> redirecionar para Home (Dashboard)
            const savedGoals = localStorage.getItem('soulrise_user_goals');
            const savedPlan = localStorage.getItem('soulrise_personalized_plan');
            
            if (savedGoals && savedPlan) {
              const goals = JSON.parse(savedGoals);
              const plan = JSON.parse(savedPlan);
              setUserGoals(goals);
              setPersonalizedPlan(plan);
              setDailyPlan(generateDailyPlan(goals[0] as Goal));
              setAppState('dashboard');
            } else {
              // Tem quiz_completed mas não tem dados - mostrar quiz
              setAppState('quiz');
            }
          } else {
            // REGRA: quiz_completed = false -> mostrar Quiz
            setAppState('quiz');
          }
        } else {
          // Not logged in - start from onboarding
          const hasSeenOnboarding = localStorage.getItem('soulrise_onboarding_complete');
          if (hasSeenOnboarding) {
            setAppState('auth');
          } else {
            setAppState('onboarding');
          }
        }
      } catch (error) {
        console.error('Erro ao verificar utilizador:', error);
        // Em caso de erro, verificar onboarding
        const hasSeenOnboarding = localStorage.getItem('soulrise_onboarding_complete');
        if (hasSeenOnboarding) {
          setAppState('auth');
        } else {
          setAppState('onboarding');
        }
      }
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes only if Supabase is configured
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const currentUserId = session.user.id;
          const userEmail = session.user.email || '';
          setUserId(currentUserId);

          // Inicializar sistema de streak
          await initializeStreak(currentUserId);

          // Verificar se é admin
          const isAdmin = await checkIsAdmin();
          
          if (isAdmin) {
            router.push('/admin');
            return;
          }

          // NOVA LÓGICA: Verificar quiz_completed no Supabase
          const quizCompleted = await checkQuizCompleted(currentUserId);

          if (quizCompleted) {
            // REGRA: quiz_completed = true -> Dashboard
            const savedGoals = localStorage.getItem('soulrise_user_goals');
            const savedPlan = localStorage.getItem('soulrise_personalized_plan');
            if (savedGoals && savedPlan) {
              const goals = JSON.parse(savedGoals);
              const plan = JSON.parse(savedPlan);
              setUserGoals(goals);
              setPersonalizedPlan(plan);
              setDailyPlan(generateDailyPlan(goals[0] as Goal));
              setAppState('dashboard');
            } else {
              setAppState('quiz');
            }
          } else {
            // REGRA: quiz_completed = false -> Quiz
            setAppState('quiz');
          }
        } else if (event === 'SIGNED_OUT') {
          setAppState('onboarding');
          setUserId(null);
          localStorage.removeItem('soulrise_onboarding_complete');
          localStorage.removeItem('soulrise_user_goals');
          localStorage.removeItem('soulrise_personalized_plan');
          localStorage.removeItem('quiz_done');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }

    // Listen for custom event to recreate plan
    const handleRecreatePlan = async () => {
      // Limpar dados do questionário
      localStorage.removeItem('soulrise_user_goals');
      localStorage.removeItem('soulrise_personalized_plan');
      
      // NOVA LÓGICA: Resetar quiz_completed no Supabase
      if (userId) {
        await resetQuizStatus(userId);
      }
      
      // REGRA: Recriar plano -> reiniciar do quiz
      setAppState('quiz');
    };

    window.addEventListener('soulrise_recreate_plan', handleRecreatePlan);

    return () => {
      window.removeEventListener('soulrise_recreate_plan', handleRecreatePlan);
    };
  }, [router, userId]);

  const handleOnboardingComplete = () => {
    // After onboarding, go to auth (cadastro/login)
    localStorage.setItem('soulrise_onboarding_complete', 'true');
    setAppState('auth');
  };

  const handleAuthSuccess = async () => {
    // Obter sessão atual
    let currentUserId: string | null = null;
    let userEmail = '';

    if (isSupabaseConfigured) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          currentUserId = session.user.id;
          userEmail = session.user.email || '';
          setUserId(currentUserId);
          
          // Inicializar sistema de streak
          await initializeStreak(currentUserId);
        }
      } catch (error) {
        console.error('Erro ao obter sessão:', error);
      }
    }

    // Verificar se é admin
    const isAdmin = await checkIsAdmin();
    
    if (isAdmin) {
      router.push('/admin');
      return;
    }

    // NOVA LÓGICA: Verificar quiz_completed no Supabase
    if (currentUserId) {
      const quizCompleted = await checkQuizCompleted(currentUserId);
      
      if (quizCompleted) {
        // REGRA: quiz_completed = true -> Dashboard
        const savedGoals = localStorage.getItem('soulrise_user_goals');
        const savedPlan = localStorage.getItem('soulrise_personalized_plan');
        if (savedGoals && savedPlan) {
          const goals = JSON.parse(savedGoals);
          const plan = JSON.parse(savedPlan);
          setUserGoals(goals);
          setPersonalizedPlan(plan);
          setDailyPlan(generateDailyPlan(goals[0] as Goal));
          setAppState('dashboard');
          return;
        }
      }
    }

    // REGRA: quiz_completed = false -> Quiz
    setAppState('quiz');
  };

  const handleQuizComplete = (answers: QuizAnswers, plan: PersonalizedPlan) => {
    // Save quiz data and personalized plan, then show questionnaire
    setQuizAnswers(answers);
    setPersonalizedPlan(plan);
    localStorage.setItem('soulrise_personalized_plan', JSON.stringify(plan));
    setAppState('questionnaire');
  };

  const handleQuestionnaireComplete = async (goals: string[]) => {
    // Save goals
    setUserGoals(goals);
    localStorage.setItem('soulrise_user_goals', JSON.stringify(goals));
    setDailyPlan(generateDailyPlan(goals[0] as Goal));

    // NOVA LÓGICA: Marcar quiz como concluído no Supabase
    if (userId) {
      await markQuizAsCompleted(userId);
    }

    // Atualizar no Supabase se configurado (opcional, mas mantém compatibilidade)
    if (userId && isSupabaseConfigured) {
      await updateProfileAfterQuiz(userId, goals);
    }

    // REGRA: Após isso, redirecionar para Home (Dashboard)
    setAppState('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar...</p>
        </div>
      </div>
    );
  }

  if (appState === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (appState === 'auth') {
    return <AuthForm onSuccess={handleAuthSuccess} />;
  }

  if (appState === 'quiz') {
    return <ConnectionQuiz onComplete={handleQuizComplete} goals={userGoals} />;
  }

  if (appState === 'questionnaire') {
    return <Questionnaire onComplete={handleQuestionnaireComplete} />;
  }

  if (appState === 'dashboard' && dailyPlan && personalizedPlan) {
    return <Dashboard goals={userGoals} dailyPlan={dailyPlan} />;
  }

  return null;
}
