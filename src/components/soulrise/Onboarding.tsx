'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);

  const screens = [
    {
      type: 'intro' as const,
      title: 'SoulRise',
      subtitle: 'Espírito. Mente. Hábitos.',
      gradient: 'from-blue-400 to-purple-500'
    },
    {
      type: 'steps' as const,
      title: 'Como funciona',
      steps: [
        { number: '1', text: 'Cadastro' },
        { number: '2', text: 'Quiz' },
        { number: '3', text: 'Plano diário' }
      ],
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      type: 'cta' as const,
      title: 'Leva 2 minutos/dia',
      description: 'Comece sua jornada de transformação pessoal agora.',
      gradient: 'from-pink-400 to-orange-400'
    }
  ];

  const currentScreen = screens[step];

  // Validação de segurança
  if (!currentScreen) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          
          {/* Screen 1: Intro com logo */}
          {currentScreen.type === 'intro' && (
            <>
              <div className="mb-6 flex justify-center">
                <svg 
                  className="h-32 w-auto md:h-40" 
                  viewBox="0 0 200 200" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="soulriseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60A5FA" />
                      <stop offset="50%" stopColor="#A78BFA" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                  
                  {/* Círculo externo */}
                  <circle cx="100" cy="100" r="90" stroke="url(#soulriseGradient)" strokeWidth="3" fill="none" opacity="0.3" />
                  
                  {/* Montanha/Elevação central */}
                  <path 
                    d="M 100 40 L 140 100 L 120 100 L 120 130 L 80 130 L 80 100 L 60 100 Z" 
                    fill="url(#soulriseGradient)"
                  />
                  
                  {/* Sol nascente */}
                  <circle cx="100" cy="50" r="15" fill="url(#soulriseGradient)" opacity="0.8" />
                  
                  {/* Raios de luz */}
                  <line x1="100" y1="30" x2="100" y2="20" stroke="url(#soulriseGradient)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="120" y1="35" x2="127" y2="28" stroke="url(#soulriseGradient)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="80" y1="35" x2="73" y2="28" stroke="url(#soulriseGradient)" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Base/Fundação */}
                  <path 
                    d="M 50 140 Q 100 135 150 140" 
                    stroke="url(#soulriseGradient)" 
                    strokeWidth="3" 
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
                {currentScreen.title}
              </h1>

              <p className="text-xl text-gray-600 mb-8">
                {currentScreen.subtitle}
              </p>
            </>
          )}

          {/* Screen 2: Como funciona */}
          {currentScreen.type === 'steps' && (
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                {currentScreen.title}
              </h1>

              <div className="space-y-6 mb-8">
                {currentScreen.steps.map((stepItem, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">{stepItem.number}</span>
                    </div>
                    <p className="text-lg font-medium text-gray-700 text-left">
                      {stepItem.text}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Screen 3: CTA */}
          {currentScreen.type === 'cta' && (
            <>
              <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${currentScreen.gradient} flex items-center justify-center shadow-lg`}>
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {currentScreen.title}
              </h1>

              <p className="text-lg text-gray-600 mb-8">
                {currentScreen.description}
              </p>
            </>
          )}

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {screens.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === step
                    ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Button */}
          {step < screens.length - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-6 text-lg rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              Continuar
            </Button>
          ) : (
            <Button
              onClick={onComplete}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 text-lg rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              Começar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
