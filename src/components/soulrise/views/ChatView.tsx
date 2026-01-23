'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Crown, Lock, AlertCircle } from 'lucide-react';
import { checkPremiumStatus } from '@/lib/premium-helpers';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIUsageData {
  questionsCount: number;
  questionsRemaining: number;
  hasReachedLimit: boolean;
  isPremium: boolean;
}

const PREMIUM_URL = 'https://soulrise-premium.lasy.pro';

export default function ChatView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou o Guia SoulRise 🌟\n\nEstou aqui para te ajudar na tua jornada de crescimento pessoal e espiritual. Podes perguntar-me sobre:\n\n• Disciplina e hábitos saudáveis\n• Mentalidade positiva\n• Clareza de propósito\n• Espiritualidade e fé\n• Desenvolvimento pessoal\n\nComo posso ajudar-te hoje?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [usage, setUsage] = useState<AIUsageData>({
    questionsCount: 0,
    questionsRemaining: 5,
    hasReachedLimit: false,
    isPremium: false
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { isPremium: premium } = checkPremiumStatus();
    setIsPremium(premium);
    
    // Obter userId se Supabase configurado
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUserId(session.user.id);
        }
      });
    }

    // Carregar histórico de mensagens do localStorage
    const savedMessages = localStorage.getItem('soulrise_chat_history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 1) {
          setMessages(parsed);
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Salvar mensagens no localStorage
    if (messages.length > 1) {
      localStorage.setItem('soulrise_chat_history', JSON.stringify(messages));
    }
    
    // Scroll para última mensagem
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Verificar se atingiu o limite (apenas para Free)
    if (!isPremium && usage.hasReachedLimit) {
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          userId: userId || 'offline-user',
          isPremium
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        // Limite atingido
        setUsage(data.usage);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message
        }]);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao comunicar com a IA');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Atualizar dados de uso
      if (data.usage) {
        setUsage(data.usage);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Desculpa, ocorreu um erro. Por favor, tenta novamente.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleUpgradeToPremium = () => {
    window.open(PREMIUM_URL, '_blank');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      {/* Header com informações de uso */}
      <div className="mb-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">Guia SoulRise</h2>
              <p className="text-sm text-gray-600">
                {isPremium ? (
                  <span className="flex items-center gap-1 text-amber-600">
                    <Crown className="w-4 h-4" />
                    Premium - Perguntas ilimitadas
                  </span>
                ) : (
                  <span className="text-gray-600">
                    {usage.questionsRemaining} {usage.questionsRemaining === 1 ? 'pergunta restante' : 'perguntas restantes'} hoje
                  </span>
                )}
              </p>
            </div>
          </div>
          
          {!isPremium && (
            <button
              onClick={handleUpgradeToPremium}
              className="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Upgrade Premium
            </button>
          )}
        </div>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-100 rounded-2xl p-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Área de input */}
      {!isPremium && usage.hasReachedLimit ? (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-lg mb-2">
                Atingiste o limite diário de perguntas gratuitas
              </h3>
              <p className="text-gray-700 mb-4">
                Continua com SoulRise Premium para orientação contínua e ilimitada.
              </p>
              <button
                onClick={handleUpgradeToPremium}
                className="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Crown className="w-5 h-5" />
                Desbloquear Premium
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-4 flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isPremium ? "Escreve a tua pergunta..." : `Escreve a tua pergunta... (${usage.questionsRemaining} restantes)`}
            className="flex-1 resize-none border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[60px] max-h-[120px]"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Aviso de uso para Free */}
      {!isPremium && !usage.hasReachedLimit && usage.questionsRemaining <= 2 && (
        <div className="mt-3 bg-amber-50 rounded-xl p-3 border border-amber-200">
          <div className="flex items-center gap-2 text-amber-800 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>
              Tens apenas {usage.questionsRemaining} {usage.questionsRemaining === 1 ? 'pergunta restante' : 'perguntas restantes'} hoje. 
              <button 
                onClick={handleUpgradeToPremium}
                className="font-semibold underline ml-1 hover:text-amber-900"
              >
                Upgrade para Premium
              </button> para perguntas ilimitadas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
