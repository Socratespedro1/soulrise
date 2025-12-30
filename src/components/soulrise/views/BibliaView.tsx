'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  Lock,
  ChevronRight,
  Heart,
  Lightbulb
} from 'lucide-react';
import PaywallModal from '../PaywallModal';

// Conteúdo dinâmico
const getConteudoBiblico = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  
  const versiculos = [
    {
      texto: '"Tudo posso naquele que me fortalece."',
      referencia: 'Filipenses 4:13',
      significado: 'Este versículo não é sobre ter superpoderes ou conseguir fazer tudo sozinho. Paulo escreveu isto enquanto estava preso, enfrentando dificuldades extremas. A mensagem é: quando te conectas com algo maior que ti, encontras uma força interior que não sabias que tinhas. Não é sobre nunca falhar, mas sobre ter coragem para continuar mesmo quando é difícil.',
      aplicacao: 'Hoje, quando enfrentares um desafio, lembra-te: a tua força não vem apenas de ti. Podes fazer mais do que imaginas quando confias em algo maior. Identifica uma situação difícil que estás a evitar e dá um pequeno passo em direção a ela. Não precisas de resolver tudo hoje, apenas começa.'
    },
    {
      texto: '"Confia no Senhor de todo o teu coração e não te apoies no teu próprio entendimento."',
      referencia: 'Provérbios 3:5',
      significado: 'Este provérbio fala sobre a humildade de reconhecer que não temos todas as respostas. Muitas vezes, queremos controlar tudo e entender cada detalhe antes de agir. Mas a vida não funciona assim. Confiar não significa ser passivo, mas sim ter a coragem de avançar mesmo sem ter tudo mapeado.',
      aplicacao: 'Nem sempre precisas de ter todas as respostas. Às vezes, dar o próximo passo com fé é suficiente. Confia no processo. Hoje, identifica uma área da tua vida onde estás a tentar controlar tudo. Pratica soltar um pouco esse controlo e observa o que acontece.'
    },
    {
      texto: '"Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus."',
      referencia: 'Isaías 41:10',
      significado: 'O medo é uma das emoções mais paralisantes. Este versículo foi escrito para um povo que estava em exílio, longe de casa, cheio de incertezas. A mensagem é clara: o medo é natural, mas não precisa de te controlar. Há uma presença maior contigo, mesmo quando te sentes sozinho.',
      aplicacao: 'O medo é natural, mas não precisa de te paralisar. Hoje, age apesar do medo. Não estás sozinho. Escreve três coisas que te assustam agora. Depois, para cada uma, escreve um pequeno passo que podes dar hoje, mesmo com medo.'
    },
    {
      texto: '"Tudo tem o seu tempo determinado, e há tempo para todo propósito debaixo do céu."',
      referencia: 'Eclesiastes 3:1',
      significado: 'Vivemos numa cultura de imediatismo, onde tudo tem de acontecer agora. Este versículo lembra-nos que a vida tem ritmos e estações. Há tempo para plantar e tempo para colher. Há tempo para construir e tempo para descansar. Respeitar esses tempos é sabedoria.',
      aplicacao: 'Se algo não está a acontecer agora, não significa que não vai acontecer. Respeita o timing. Confia no processo. Hoje, identifica algo que estás a forçar. Pergunta-te: será que este é o momento certo? Se não for, o que podes fazer para te preparar para quando for?'
    }
  ];

  return {
    versiculo: versiculos[dayOfYear % versiculos.length]
  };
};

export default function BibliaView() {
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallType, setPaywallType] = useState<'significado' | 'aplicacao'>('significado');
  const isPremium = false;

  const conteudo = getConteudoBiblico();

  const handlePremiumClick = (type: 'significado' | 'aplicacao') => {
    if (!isPremium) {
      setPaywallType(type);
      setShowPaywall(true);
    }
  };

  // Pré-visualização: primeiras 1-2 linhas
  const getPreview = (text: string) => {
    const sentences = text.split('. ');
    return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '...' : '');
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Bíblia 📖
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Palavra viva aplicada à vida diária
        </p>
      </div>

      {/* Versículo do Dia - FREE (sempre acessível) */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 md:p-8 shadow-lg mb-6 border-2 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Versículo do Dia</h2>
        </div>
        <p className="text-gray-800 text-lg md:text-xl leading-relaxed italic mb-4">
          {conteudo.versiculo.texto}
        </p>
        <p className="text-purple-600 font-semibold">
          {conteudo.versiculo.referencia}
        </p>
      </div>

      {/* O que significa este versículo - PREMIUM com preview */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6 border-2 border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">O que significa este versículo</h2>
        </div>
        
        {/* Pré-visualização (1-2 linhas) */}
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
          {getPreview(conteudo.versiculo.significado)}
        </p>

        {/* Paywall suave */}
        {!isPremium && (
          <button
            onClick={() => handlePremiumClick('significado')}
            className="w-full bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200 hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed text-left">
                Este conteúdo ajuda a compreender e aplicar a Palavra no dia a dia.
              </p>
              <Lock className="w-5 h-5 text-blue-500 flex-shrink-0 ml-3 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-600 font-semibold text-sm md:text-base">
                Disponível no SoulRise Premium
              </span>
              <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        )}

        {/* Conteúdo completo para Premium */}
        {isPremium && (
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            {conteudo.versiculo.significado}
          </p>
        )}
      </div>

      {/* Como aplicar este versículo hoje - PREMIUM com preview */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6 border-2 border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Como aplicar este versículo hoje</h2>
        </div>
        
        {/* Pré-visualização (1-2 linhas) */}
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
          {getPreview(conteudo.versiculo.aplicacao)}
        </p>

        {/* Paywall suave */}
        {!isPremium && (
          <button
            onClick={() => handlePremiumClick('aplicacao')}
            className="w-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200 hover:border-green-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed text-left">
                Este conteúdo ajuda a compreender e aplicar a Palavra no dia a dia.
              </p>
              <Lock className="w-5 h-5 text-green-500 flex-shrink-0 ml-3 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-600 font-semibold text-sm md:text-base">
                Disponível no SoulRise Premium
              </span>
              <ChevronRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        )}

        {/* Conteúdo completo para Premium */}
        {isPremium && (
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            {conteudo.versiculo.aplicacao}
          </p>
        )}
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          feature={paywallType === 'significado' ? 'Significado do Versículo' : 'Aplicação Prática do Versículo'}
          benefits={[
            'Compreende o contexto e significado profundo de cada versículo',
            'Aplica a Palavra de forma prática no teu dia a dia',
            'Reflexões guiadas para crescimento espiritual'
          ]}
        />
      )}
    </div>
  );
}
