'use client';

import { X, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PREMIUM_URL = 'https://soulrise-premium.lasy.pro';

interface PaywallModalProps {
  onClose: () => void;
  feature: string;
  benefits: string[];
}

export default function PaywallModal({ onClose, feature, benefits }: PaywallModalProps) {
  const handleUpgradeClick = () => {
    window.open(PREMIUM_URL, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-8 text-white rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-3">
              Desbloqueia {feature}
            </h2>
            <p className="text-lg text-purple-100">
              Aprofunda a tua jornada com conteúdo Premium
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-4 text-lg">
              Com Premium tens acesso a:
            </h3>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleUpgradeClick}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-lg py-6 rounded-xl shadow-xl"
            >
              🔓 Desbloquear Premium Agora
            </Button>
            <p className="text-sm text-gray-500 text-center">
              Cancela quando quiseres. Sem compromissos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
