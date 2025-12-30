'use client';

import { useState, useRef } from 'react';
import { BookOpen, Sparkles, Heart, ChevronRight, Book, MessageCircle, Volume2 } from 'lucide-react';
import { versiculosDoDia, reflexoesEspirituais, guiasEspirituais } from '@/lib/soulrise-data';
import { Button } from '@/components/ui/button';
import BibliaManualVida from '@/components/soulrise/BibliaManualVida';

type ViewMode = 'main' | 'guide' | 'biblia';

export default function EspiritualidadeView() {
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  // Refs para scroll automático
  const bibliaRef = useRef<HTMLDivElement>(null);
  const oracaoRef = useRef<HTMLDivElement>(null);
  const reflexaoRef = useRef<HTMLDivElement>(null);
  const silencioRef = useRef<HTMLDivElement>(null);

  const randomVersiculo = versiculosDoDia[Math.floor(Math.random() * versiculosDoDia.length)];
  const randomReflexao = reflexoesEspirituais[Math.floor(Math.random() * reflexoesEspirituais.length)];

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (viewMode === 'biblia') {
    return <BibliaManualVida onBack={() => setViewMode('main')} />;
  }

  if (viewMode === 'guide' && selectedGuide) {
    const guide = guiasEspirituais.find(g => g.id === selectedGuide);
    if (!guide) return null;

    return (
      <div className="max-w-3xl mx-auto pb-20 md:pb-8">
        <Button
          onClick={() => {
            setSelectedGuide(null);
            setViewMode('main');
          }}
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          ← Voltar
        </Button>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {guide.titulo}
          </h1>
          <p className="text-purple-600 font-medium mb-6 text-lg">
            {guide.descricao}
          </p>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed text-base md:text-lg">
              {guide.conteudo}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Espiritualidade ✨
        </h1>
        <p className="text-gray-600 text-lg">
          Aprofunda a tua conexão espiritual
        </p>
      </div>

      {/* ACESSOS RÁPIDOS - NAVEGAÇÃO INTERNA */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 md:p-6 mb-6 border-2 border-purple-200">
        <h3 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Acesso Rápido
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          <button
            onClick={() => scrollToSection(bibliaRef)}
            className="bg-white hover:bg-purple-50 rounded-xl p-3 border border-purple-200 hover:border-purple-400 transition-all duration-200 flex flex-col items-center gap-2 group"
          >
            <Book className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-gray-700">Bíblia</span>
          </button>
          <button
            onClick={() => scrollToSection(oracaoRef)}
            className="bg-white hover:bg-purple-50 rounded-xl p-3 border border-purple-200 hover:border-purple-400 transition-all duration-200 flex flex-col items-center gap-2 group"
          >
            <MessageCircle className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-gray-700">Oração</span>
          </button>
          <button
            onClick={() => scrollToSection(reflexaoRef)}
            className="bg-white hover:bg-purple-50 rounded-xl p-3 border border-purple-200 hover:border-purple-400 transition-all duration-200 flex flex-col items-center gap-2 group"
          >
            <BookOpen className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-gray-700">Reflexão</span>
          </button>
          <button
            onClick={() => scrollToSection(silencioRef)}
            className="bg-white hover:bg-purple-50 rounded-xl p-3 border border-purple-200 hover:border-purple-400 transition-all duration-200 flex flex-col items-center gap-2 group"
          >
            <Volume2 className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-gray-700">Silêncio</span>
          </button>
        </div>
      </div>

      {/* Bíblia: O Manual da Vida - DESTAQUE */}
      <div 
        ref={bibliaRef}
        onClick={() => setViewMode('biblia')}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-6 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 rounded-full p-3">
            <Book className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1">Bíblia: O Manual da Vida</h2>
            <p className="text-white/90 text-sm md:text-base">
              Procura versículos por tema e encontra orientação para o teu dia
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-white/90 text-sm md:text-base">
          <span>Explorar temas bíblicos</span>
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>

      {/* Versículo do Dia */}
      <div ref={reflexaoRef} className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6" />
          <h3 className="font-semibold text-lg md:text-xl">Versículo do Dia</h3>
        </div>
        <p className="text-lg md:text-xl leading-relaxed mb-4 italic">
          "{randomVersiculo.texto}"
        </p>
        <p className="text-sm md:text-base opacity-90">
          — {randomVersiculo.referencia}
        </p>
      </div>

      {/* Reflexão Espiritual */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6" />
          <h3 className="font-semibold text-lg md:text-xl">Reflexão Espiritual</h3>
        </div>
        <p className="text-base md:text-lg leading-relaxed">
          {randomReflexao}
        </p>
      </div>

      {/* Meditação / Oração */}
      <div ref={oracaoRef} className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-6 h-6 text-pink-500" />
          <h2 className="text-2xl font-bold text-gray-800">Meditação & Oração</h2>
        </div>
        <div className="space-y-4">
          <div ref={silencioRef} className="p-4 rounded-xl bg-pink-50 border border-pink-200">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">
              Momento de Silêncio
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              Dedica 10 minutos para estar em silêncio e ouvir a voz interior.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">
              Oração do Coração
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              Fala com Deus sobre as tuas alegrias, desafios e gratidão.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">
              Respiração Consciente
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              Pratica 5 minutos de respiração profunda e consciente.
            </p>
          </div>
        </div>
      </div>

      {/* Guias Espirituais */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Guias Espirituais
        </h2>
        <div className="space-y-3">
          {guiasEspirituais.map((guide) => (
            <button
              key={guide.id}
              onClick={() => {
                setSelectedGuide(guide.id);
                setViewMode('guide');
              }}
              className="w-full p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-purple-300 hover:shadow-md transition-all duration-300 text-left flex items-center justify-between group"
            >
              <div>
                <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">
                  {guide.titulo}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm">
                  {guide.descricao}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
