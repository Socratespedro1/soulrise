'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const sugestoesIniciais = [
  "Como posso criar hábitos mais consistentes?",
  "Estou a sentir-me perdido. Como encontro o meu propósito?",
  "Preciso de ajuda para gerir a ansiedade",
  "O que a Bíblia diz sobre superar o medo?",
  "Como posso fortalecer a minha fé no dia a dia?"
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    
    if (!textToSend || isLoading) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error('Erro na resposta da API');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Desculpa, ocorreu um erro. Por favor, tenta novamente.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Guia SoulRise</h1>
              <p className="text-xs text-gray-500">Orientação espiritual e pessoal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Olá! Sou o teu Guia SoulRise
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Estou aqui para te ajudar no teu crescimento pessoal e espiritual. 
                Podes fazer-me perguntas sobre disciplina, hábitos, fé, propósito de vida, 
                Bíblia e muito mais. Como posso ajudar-te hoje?
              </p>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Sugestões para começar:
                </p>
                {sugestoesIniciais.map((sugestao, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(sugestao)}
                    className="block w-full max-w-2xl mx-auto bg-white hover:bg-gray-50 text-left px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
                  >
                    <p className="text-gray-700">{sugestao}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-md ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 rounded-lg">
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-gray-600">Guia SoulRise</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 rounded-2xl px-6 py-4 shadow-md border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                      <span className="text-sm text-gray-600">A pensar...</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escreve a tua pergunta ou partilha o que sentes..."
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none transition-all duration-200 text-sm md:text-base"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl px-6 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            O Guia SoulRise oferece orientação, mas não substitui profissionais de saúde ou líderes religiosos.
          </p>
        </div>
      </div>
    </div>
  );
}
