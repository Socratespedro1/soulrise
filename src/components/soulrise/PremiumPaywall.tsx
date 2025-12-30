'use client';

import { Crown, X, Sparkles } from 'lucide-react';
import { getPaywallMessage } from '@/lib/premium-helpers';

const CHECKOUT_URL = 'https://pay.kambafy.com/checkout/a8abc16a-4344-4e32-b456-4f69592454ac';

interface PremiumPaywallProps {
  area: 'home' | 'desenvolvimento' | 'espiritualidade' | 'biblia' | 'saude' | 'perfil';
  onClose: () => void;
  preview?: string; // Pré-visualização do conteúdo
}

export default function PremiumPaywall({ area, onClose, preview }: PremiumPaywallProps) {
  const message = getPaywallMessage(area);

  const handleUpgradeClick = () => {
    window.open(CHECKOUT_URL, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Conteúdo Premium</h2>
                <p className="text-sm text-amber-100">Desbloqueia acesso completo</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Preview (se disponível) */}
        {preview && (
          <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-b-2 border-amber-200">
            <div className="flex items-start gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Pré-visualização</h3>
                <p className="text-gray-700 leading-relaxed line-clamp-3">
                  {preview}
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-50 pointer-events-none"></div>
              <p className="text-sm text-amber-700 font-medium text-center mt-2">
                Continua com Premium →
              </p>
            </div>
          </div>
        )}

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Título e Descrição */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {message.title}
            </h3>
            <p className="text-gray-600">
              {message.description}
            </p>
          </div>

          {/* Benefícios */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-600" />
              O que vais desbloquear:
            </h4>
            <ul className="space-y-3">
              {message.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mensagem motivacional */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 text-center">
            <p className="text-gray-700 italic">
              "Investe no teu crescimento. Desbloqueia todo o potencial da SoulRise."
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleUpgradeClick}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              🔓 Fazer Upgrade para Premium
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200"
            >
              Voltar
            </button>
          </div>

          {/* Nota de rodapé */}
          <p className="text-xs text-gray-500 text-center">
            Cancela a qualquer momento. Sem compromissos.
          </p>
        </div>
      </div>
    </div>
  );
}
