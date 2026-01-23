'use client';

import { useState } from 'react';
import { Home, User, Sparkles, BookOpen, Menu, X, LogOut, MessageCircle, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import HomeView from './views/HomeView';
import DesenvolvimentoView from './views/DesenvolvimentoView';
import EspiritualidadeView from './views/EspiritualidadeView';
import SaudeView from './views/SaudeView';
import { DailyPlan } from '@/lib/soulrise-data';
import { PersonalizedPlan } from './ConnectionQuiz';
import Logo from './Logo';
import Link from 'next/link';

interface DashboardProps {
  goals: string[];
  dailyPlan: DailyPlan;
  isPremiumUser?: boolean;
}

type View = 'home' | 'desenvolvimento' | 'espiritualidade' | 'saude';

export default function Dashboard({ goals, dailyPlan, isPremiumUser = false }: DashboardProps) {
  const [currentView, setCurrentView] = useState<View>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Recuperar plano personalizado do localStorage
  const getPersonalizedPlan = (): PersonalizedPlan | null => {
    const savedPlan = localStorage.getItem('soulrise_personalized_plan');
    if (savedPlan) {
      return JSON.parse(savedPlan);
    }
    return null;
  };

  const personalizedPlan = getPersonalizedPlan();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erro ao fazer logout:', error.message);
      }
      // Recarrega a página para limpar o estado
      window.location.reload();
    } catch (err) {
      console.error('Erro inesperado ao fazer logout:', err);
      // Mesmo com erro, recarrega para limpar o estado
      window.location.reload();
    }
  };

  const navigation = [
    { id: 'home' as View, label: 'Início', icon: Home },
    { id: 'desenvolvimento' as View, label: 'Desenvolvimento', icon: BookOpen },
    { id: 'espiritualidade' as View, label: 'Espiritualidade', icon: Sparkles },
    { id: 'saude' as View, label: 'Saúde & Bem-Estar', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-auto" />
          <span className="font-bold text-xl text-gray-800">SoulRise</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/chat">
            <button
              className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md"
              title="Chat com IA"
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Sair"
          >
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
          <div className="p-6 flex flex-col h-screen">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <Logo className="h-10 w-auto" />
              <span className="font-bold text-2xl text-gray-800">SoulRise</span>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 flex-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}

              {/* Perfil Link */}
              <Link href="/perfil">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Perfil</span>
                </button>
              </Link>

              {/* Chat com IA Button */}
              <Link href="/chat">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg mt-4">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">Chat com IA</span>
                </button>
              </Link>
            </nav>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 mt-4"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          {currentView === 'home' && (
            <HomeView 
              goals={goals} 
              dailyPlan={dailyPlan} 
              personalizedPlan={personalizedPlan}
            />
          )}
          {currentView === 'desenvolvimento' && <DesenvolvimentoView />}
          {currentView === 'espiritualidade' && <EspiritualidadeView isPremiumUser={isPremiumUser} />}
          {currentView === 'saude' && <SaudeView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-3 shadow-lg">
        <div className="flex justify-around items-center">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-200 ${
                  isActive ? 'text-purple-600' : 'text-gray-500'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
          <Link href="/perfil">
            <button className="flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-200 text-gray-500 hover:text-purple-600">
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Perfil</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
