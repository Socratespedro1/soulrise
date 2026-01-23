'use client';

import { Button } from '@/components/ui/button';
import { Heart, Lock } from 'lucide-react';
import { Oracao } from '@/lib/soulrise-data';

interface OracaoViewProps {
  oracao: Oracao;
  isPremiumUser: boolean;
  onBack: () => void;
}

export default function OracaoView({ oracao, isPremiumUser, onBack }: OracaoViewProps) {
  const showPaywall = oracao.isPremium && !isPremiumUser;
  const displayText = showPaywall && oracao.previewText ? oracao.previewText : oracao.textoCompleto;

  return (
    <div className="max-w-3xl mx-auto pb-20 md:pb-8">
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-6 text-gray-600 hover:text-gray-800"
      >
        ← Voltar
      </Button>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 md:p-10 shadow-xl border-2 border-purple-200">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {oracao.titulo}
            </h1>
            <p className="text-purple-600 font-medium text-sm md:text-base">
              {oracao.descricao}
            </p>
          </div>
        </div>

        {/* Contexto */}
        <div className="bg-white/70 rounded-xl p-4 md:p-6 mb-6 border border-purple-200">
          <p className="text-gray-700 leading-relaxed text-sm md:text-base italic">
            {oracao.contexto}
          </p>
        </div>

        {/* Texto da Oração */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-md">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-line text-base md:text-lg">
              {displayText}
            </div>
          </div>

          {/* Paywall para Orações Premium */}
          {showPaywall && (
            <div className="mt-8 pt-8 border-t-2 border-purple-200">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 md:p-8 text-center border-2 border-purple-300">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                  Esta oração completa faz parte do acompanhamento espiritual da SoulRise
                </h3>
                <p className="text-gray-700 mb-6 text-sm md:text-base">
                  Continua com SoulRise Premium.
                </p>
                <Button
                  onClick={() => window.open('https://soulrise-premium.lasy.pro', '_blank')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Desbloquear Premium
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
