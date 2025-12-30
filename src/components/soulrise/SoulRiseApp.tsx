'use client';

import { useState } from 'react';
import { Home, Brain, BookOpen, Heart, Leaf, User } from 'lucide-react';
import HomeView from './views/HomeView';
import DesenvolvimentoView from './views/DesenvolvimentoView';
import EspiritualidadeView from './views/EspiritualidadeView';
import BibliaView from './views/BibliaView';
import SaudeView from './views/SaudeView';
import PerfilView from './views/PerfilView';

type View = 'home' | 'desenvolvimento' | 'espiritualidade' | 'biblia' | 'saude' | 'perfil';

export default function SoulRiseApp() {
  const [currentView, setCurrentView] = useState<View>('home');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'desenvolvimento':
        return <DesenvolvimentoView />;
      case 'espiritualidade':
        return <EspiritualidadeView />;
      case 'biblia':
        return <BibliaView />;
      case 'saude':
        return <SaudeView />;
      case 'perfil':
        return <PerfilView />;
      default:
        return <HomeView />;
    }
  };

  const navItems = [
    { id: 'home' as View, icon: Home, label: 'Home' },
    { id: 'desenvolvimento' as View, icon: Brain, label: 'Desenvolvimento' },
    { id: 'espiritualidade' as View, icon: Heart, label: 'Espiritualidade' },
    { id: 'biblia' as View, icon: BookOpen, label: 'Bíblia' },
    { id: 'saude' as View, icon: Leaf, label: 'Saúde' },
    { id: 'perfil' as View, icon: User, label: 'Perfil' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            SoulRise
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {renderView()}
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 shadow-lg">
        <div className="grid grid-cols-6 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                  isActive
                    ? 'text-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-medium leading-tight text-center">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Side Navigation - Desktop */}
      <nav className="hidden md:block fixed left-0 top-20 bottom-0 w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
